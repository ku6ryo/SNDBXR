using UnityEngine;
using System.IO;
using UnityEngine.Networking;
using System.Collections.Generic;
using WasmerSharp;
using System;

public class ConnectorWasmerSharp
{
    const int GET_OBJECT_ID_BY_NAME = 0;
    const int SET_OBJECT_POSITION = 1;

    private ConnectorCore Core = null;

    private Instance wasmInstance = null;

    public void Init(ConnectorCore core)
    {
        this.Core = core;

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
            var memory = Memory.Create (minPages: 256, maxPages: 256);

            // Now we surface the memory as an import
            var memoryImport = new Import ("env", "memory", memory);

            var abortFunc = new Import ("env", "abort", 
                    new ImportFunction ((Action<InstanceContext,int,int,int,int>) (Abort)));
            var logIntFunc = new Import ("env", "logInt", 
                    new ImportFunction ((Action<InstanceContext,int>) (LogInt)));
            var execISFunc = new Import ("env", "execIS", 
                    new ImportFunction ((Func<InstanceContext, int, int, int>) (ExecIS)));
            var execIIV3Func = new Import ("env", "execIIV3", 
                    new ImportFunction ((Func<InstanceContext, int, int, float, float, float, int>) (ExecIIV3)));
            
            Import[] imports = new Import[] {
                memoryImport,
                abortFunc,
                logIntFunc,
                execISFunc,
                execIIV3Func,
            };

            // Now we create an instance based on the WASM file, and the memory provided:
            this.wasmInstance = new Instance (wasm, imports);
            var ret = this.wasmInstance.Call("Test");
            if (ret == null) {
                Debug.Log("No result");
            } else {
                Debug.Log(ret[0]);
            }
            this.Core.Connect();
        };
    }

    public void Abort (InstanceContext ctx, int msgPtr, int filenamePtr, int lineNum, int columNum)
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
    private int ExecII(InstanceContext context, int funcId, int int1, int int2)
    {
        switch(funcId)
        {
            default:
                throw new System.Exception("No function to match");
        }
    }

    private int ExecIS(InstanceContext context, int funcId, int strPtr)
    {
        switch(funcId)
        {
            case GET_OBJECT_ID_BY_NAME:
                return this.Core.GetObjectByName("Cube");
            default:
                throw new System.Exception("No function to match");
        }
    }
    private int ExecIIV3(InstanceContext context, int funcId, int i1, float f1, float f2, float f3)
    {
        switch(funcId)
        {
            case SET_OBJECT_POSITION:
                return this.Core.SetObjectPosition(i1, f1, f2, f3);
            default:
                throw new System.Exception("No function to match");
        }
    }
 
    public void Test()
    {
    }

    public void Update()
    {
        this.wasmInstance.Call("update");
    }

    public void Connect()
    {
        this.Core.Connect();
    }

    public void Disconnect()
    {
        this.Core.Disconnect();
    }
}
