#include <jni.h>
#include <string>
#include <cstdio>
#include "wasm3_cpp.h"
#include <iostream>
#include <sstream>

// Currently, crashes occurring 5 - 10 min after app launch. This needs to be fixed.
// JNI global reference table overflow (max=51200)global reference table dump
// https://stackoverflow.com/questions/36143101/why-do-i-need-to-release-global-references-created-in-jni-native-functions/36143581#36143581
JavaVM* javaVM;
JNIEnv* jniEnv;
jclass  activityClz;
jobject activityObj;

wasm3::environment env;
wasm3::runtime runtime = env.new_runtime(10240);

void logString(const char *str) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "log", "(Ljava/lang/String;)V");
    jniEnv->CallVoidMethod(activityObj, methodId, jniEnv->NewStringUTF(str));
}

void aAbort(int a, int b, int c, int d)
{
}

int createCall(int numValues, int numReturns, int funcId) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "createCall", "(III)I");
    return jniEnv->CallIntMethod(activityObj, methodId, numValues, numReturns, funcId);
}

void setCallArgInt(int callId, int index, int value) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "setCallArgInt", "(III)V");
    return jniEnv->CallVoidMethod(activityObj, methodId, callId, index, value);
}

void setCallArgFloat(int callId, int index, float value) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "setCallArgFloat", "(IIF)V");
    return jniEnv->CallVoidMethod(activityObj, methodId, callId, index, value);
}

int getCallReturnInt(int callId, int index) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "getCallReturnInt", "(II)I");
    return jniEnv->CallIntMethod(activityObj, methodId, callId, index);
}
float getCallReturnFloat(int callId, int index) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "getCallReturnFloat", "(II)F");
    return jniEnv->CallFloatMethod(activityObj, methodId, callId, index);
}

void setCallReturnInt(int callId, int index, int value) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "setCallReturnInt", "(III)V");
    return jniEnv->CallVoidMethod(activityObj, methodId, callId, index, value);
}

void setCallReturnFloat(int callId, int index, float value) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "setCallReturnFloat", "(IIF)V");
    return jniEnv->CallVoidMethod(activityObj, methodId, callId, index, value);
}

void callEngine32(int callId) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "callEngine32", "(I)V");
    return jniEnv->CallVoidMethod(activityObj, methodId, callId);
}

void trashCall(int callId) {
    jmethodID methodId = jniEnv->GetMethodID(activityClz, "trashCall", "(I)V");
    return jniEnv->CallVoidMethod(activityObj, methodId, callId);
}

/**
 * Memory layout
 * | i32 (n of args) |  i32 (n of returns) | = 2 x 4 bytes
 * | i32 (arg type) x n of args | i32 (return type) x n of returns | = 4 x (n of args) + 4 x (n of returns)
 * | i32 or f32 arg | i32 or f32 return value | = 4 x (n of args) + 4 x (n of returns)
 * @param p
 * @param funcId
 */
void _callEngine32(void* p, int funcId)
{
    int* iPtr = (int *) p;
    float* fPtr = (float *) p;
    int numArgs = *iPtr;
    int numReturns = *(iPtr + 1);
    int callId = createCall(numArgs, numReturns, funcId);

    std::string str = "";
    std::stringstream ss;
    ss << funcId << "," << numArgs << "," << numReturns;
    for (int i = 0; i < numArgs; i++)
    {
       int type = *(iPtr + 2 + i);
       if (type == 1) {
           int v = *(iPtr + 2 + numArgs + numReturns + i);
           ss << "," << v;
           setCallArgInt(callId, i, v);
       } else if (type == 2) {
           float v = *(fPtr + 2 + numArgs + numReturns + i);
           ss << "," << v;
           setCallArgFloat(callId, i, v);
       }
    }
    for (int i = 0; i < numReturns; i++)
    {
        int type = *(iPtr + 2 + numArgs + i);
        if (type == 1) {
            setCallReturnInt(callId, i, 0);
        } else if (type == 2) {
            setCallReturnFloat(callId, i, 0.0);
        }
    }
    ss << std::endl;
    ss >> str;
    logString(str.c_str());
    callEngine32(callId);
    for (int i = 0; i < numReturns; i++)
    {
        int type = *(iPtr + 2 + numArgs + i);
        if (type == 1) {
            *(iPtr + 2 + numArgs * 2 + numReturns + i) = getCallReturnInt(callId, i);
        } else if (type == 2) {
            *(fPtr + 2 + numArgs * 2 + numReturns + i) = getCallReturnFloat(callId, i);
        }
    }
    // Trashing call object is needed but doing it here causes a crash.
    // It needs to be investivated.
}

int run(uint8_t* wasm, int wasm_len)
{
    std::cout << "Loading WebAssembly..." << std::endl;
    try {
        wasm3::module mod = env.parse_module(wasm, wasm_len);
        runtime.load(mod);
        // mod.link("module", "addTwo", addTwo4);
        logString("linking");
        mod.link("env", "abort", aAbort);
        mod.link("proto", "_callEngine32", _callEngine32);
        {
            wasm3::function start_fn = runtime.find_function("start");
            logString("call start()");
            auto res = start_fn.call<int>();
            std::cout << "result: " << res << std::endl;
            return res;
        }
    }
    catch(wasm3::error &e) {
        std::cerr << "WASM3 error: " << e.what() << std::endl;
        logString(e.what());
        return 1;
    }

    return 0;
}

extern "C"
JNIEXPORT jint JNICALL
Java_org_sndbxr_android_lib_WasmSandbox_runWasm(
        JNIEnv *env,
        jobject thiz,
        jbyteArray wasm,
        jint len) {
    int8_t *dataPtr;
    jboolean copied = false;
    dataPtr = env->GetByteArrayElements(wasm, &copied);
    jniEnv = env;
    activityClz = env->GetObjectClass(thiz);
    activityObj = env->NewGlobalRef(thiz);
    int r = run(reinterpret_cast<uint8_t *>(dataPtr), len);
    return r;
}

extern "C"
JNIEXPORT int JNICALL
Java_org_sndbxr_android_lib_WasmSandbox_updateWasm(
        JNIEnv *env,
        jobject thiz) {
    jniEnv = env;
    activityClz = env->GetObjectClass(thiz);
    activityObj = env->NewGlobalRef(thiz);
    try {
        wasm3::function fn = runtime.find_function("update");
        fn.call<void *>();
    }
    catch(wasm3::error &e) {
        // On updates, argument count mismach is observed. but ignoring now.
        // This can be a bug. So the cause needs to be investigated.
        logString(e.what());
        return 1;
    }
    return 0;
}
