This is director of Android Library to run SNDBXR scripts on Android.
There are two modules; app and lib.
app module is the App to test lib without any 3D rendergin enginges. lib is the library itself.

# Lib
The library has two layers. Kotlin layer and C++ native code layer.
Those two are connected by [JNI](https://developer.android.com/training/articles/perf-jni).
In C++ layer, the lib is running [Wasm3](https://github.com/wasm3/wasm3) to run SNDBXR scripts on WASM.

TODO: Currently Wasm3 C/C++ codes are included in this code base as it is. It will be pointed by git submodule in the near future.

# How to run the app
Just open this directory on Android Studio and click the build button by targeting app (default).

# How to build the lib and port it to Unity.
Change build target to lib and click the build button. The AAR is stored in lib/build/outputs/aar.
If build succeeded, you should see lib-release.aar and lib-debug.aar. Copy one of them depending on your purpose to Unity's
Assets/Plugins/Android. If you already see a AAR file in there, please remove the old one.