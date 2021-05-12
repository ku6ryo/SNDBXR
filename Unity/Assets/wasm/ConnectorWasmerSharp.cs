using System;
using System.IO;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using WasmerSharp;

public class ConnectorWasmerSharp
{
    const int GET_OBJECT_ID_BY_NAME = 1000;
    const int SET_OBJECT_POSITION = 1100;
    const int GET_OBJECT_POSITION = 1101;

    const int GET_MATERIAL_OF_OBJECT = 1200;

    const int SET_OBJECT_EVENT_LISTENER = 1300;

    const int GET_MATERIAL_ID_BY_NAME = 2000;
    const int SET_MATERIAL_COLOR = 2100;

    private static ConnectorCore StaticCore = null;

    private static Instance wasmInstance = null;

    public void Init(ConnectorCore core)
    {
        ConnectorWasmerSharp.StaticCore = core;

        string url = "http://192.168.1.5:8080/scripting/build/untouched.wasm";
        UnityWebRequest req = UnityWebRequest.Get(url);
        req.SendWebRequest().completed += operation =>
        {
            MemoryStream stream = new MemoryStream();
            stream.Write(req.downloadHandler.data, 0, req.downloadHandler.data.Length);
            stream.Seek(0, SeekOrigin.Begin);
            var wasm = stream.ToArray();

            // This creates a memory block with a minimum of 256 64k pages
            // and a maxium of 256 64k pages
            var memory = Memory.Create(minPages: 10);

            // Now we surface the memory as an import
            var memoryImport = new Import ("env", "memory", memory);

            var abortFunc = new Import ("env", "abort", 
                    new ImportFunction ((Action<InstanceContext,int,int,int,int>) (Abort)));
            var logIntFunc = new Import ("env", "logInt",
                    new ImportFunction ((Action<InstanceContext, int>) (LogInt)));
            var logFloatFunc = new Import ("env", "logFloat",
                    new ImportFunction ((Action<InstanceContext, float>) (LogFloat)));
            var logStringFunc = new Import ("env", "logString",
                    new ImportFunction ((Action<InstanceContext, int, int>) (LogString)));
            var execI_IFunc = new Import ("env", "execI_I", 
                    new ImportFunction ((Func<InstanceContext, int, int, int>) (ExecI_I)));
            var execI_IIFunc = new Import ("env", "execI_II", 
                    new ImportFunction ((Func<InstanceContext, int, int, int, int>) (ExecI_II)));
            var execI_SFunc = new Import ("env", "execI_S", 
                    new ImportFunction ((Func<InstanceContext, int, int, int, int>) (ExecI_S)));
            var execI_IV3Func = new Import ("env", "execI_IV3", 
                    new ImportFunction ((Func<InstanceContext, int, int, float, float, float, int>) (ExecI_IV3)));
            var execI_IV4Func = new Import ("env", "execI_IV4",
                    new ImportFunction ((Func<InstanceContext, int, int, float, float, float, float, int>) (ExecI_IV4)));
            var execV3_IFunc = new Import ("env", "execV3_I",
                    new ImportFunction ((Func<InstanceContext, int, int, int>) (ExecV3_I)));
            
            Import[] imports = new Import[] {
                memoryImport,
                abortFunc,
                logIntFunc,
                logFloatFunc,
                logStringFunc,
                execI_IFunc,
                execI_IIFunc,
                execI_SFunc,
                execI_IV3Func,
                execI_IV4Func,
                execV3_IFunc,
            };

            // Now we create an instance based on the WASM file, and the memory provided:
            wasmInstance = new Instance (wasm, imports);
            var ret = wasmInstance.Call("start");
            if (ret == null) {
                Debug.Log("No result");
            } else {
                Debug.Log(ret[0]);
            }
            core.Connect();
        };
    }

    public static void Abort (InstanceContext ctx, int msgPtr, int filenamePtr, int lineNum, int columNum)
    {
        Debug.Log("Abort");
        Debug.Log(lineNum);
        Debug.Log(columNum);
        /*
        var memoryBase = ctx.GetMemory (0).Data;
        unsafe {
            var str = Encoding.UTF8.GetString ((byte*)memoryBase + ptr, len);

            Console.WriteLine ("Received this utf string: [{0}]", str);
        }
        */
    }
    private static void LogInt(InstanceContext ctx, int value)
    {
        Debug.Log("LogInt: " + value.ToString());
    }
    private static void LogFloat(InstanceContext ctx, float value)
    {
        Debug.Log("LogFloat: " + value.ToString());
    }
    private static void LogString(InstanceContext context, int ptr, int len)
    {
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + ptr, len);
            Debug.Log(str);
        }
    }
    private static int ExecI_I(InstanceContext context, int funcId, int int1)
    {
        switch(funcId)
        {
            case GET_MATERIAL_OF_OBJECT:
                return StaticCore.GetMaterialByObjectId(int1);
            default:
                throw new System.Exception("No function to match");
        }
    }
    private static int ExecI_II(InstanceContext context, int funcId, int i1, int i2)
    {
        switch(funcId)
        {
            case SET_OBJECT_EVENT_LISTENER:
                return StaticCore.SetObjectEventListener(i1, i2, () => {
                    Debug.Log("clicked22");
                    wasmInstance.Call("onEvent", new object[]{ i1, i2 });
                });
            default:
                throw new System.Exception("No function to match");
        }
    }

    private static int ExecI_S(InstanceContext context, int funcId, int strPtr, int len)
    {
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + strPtr, len);
        }
        switch(funcId)
        {
            case GET_OBJECT_ID_BY_NAME:
                return StaticCore.GetObjectByName(str);
            case GET_MATERIAL_ID_BY_NAME:
                return StaticCore.GetMaterialByName(str);
            default:
                throw new System.Exception("No function to match");
        }
    }
    private static int ExecI_IV3(InstanceContext context, int funcId, int i1, float f1, float f2, float f3)
    {
        switch(funcId)
        {
            case SET_OBJECT_POSITION:
                return StaticCore.SetObjectPosition(i1, f1, f2, f3);
            default:
                throw new System.Exception("No function to match");
        }
    }
    private static int ExecI_IV4(InstanceContext context, int funcId, int i1, float f1, float f2, float f3, float f4)
    {
        switch(funcId)
        {
            case SET_MATERIAL_COLOR:
                return StaticCore.SetMaterialColor(i1, f1, f2, f3, f4);
            default:
                throw new System.Exception("No function to match");
        }
    }
    private static int ExecV3_I(InstanceContext context, int funcId, int i1)
    {
        switch (funcId)
        {
            case GET_OBJECT_POSITION:
                var pos = StaticCore.GetObjectPosition(i1);
                if (pos == null) {
                    return -1;
                } else {
                    unsafe {
                        var ptr = (float*) context.GetMemory(0).Data;
                        *ptr = pos.Value.x;
                        ptr++;
                        *ptr = pos.Value.y;
                        ptr++;
                        *ptr = pos.Value.z;
                        return 0;
                    }
                }
            default:
                throw new System.Exception("No function to match");
        }
    }

    public void Update()
    {
        wasmInstance.Call("update");
    }
}
