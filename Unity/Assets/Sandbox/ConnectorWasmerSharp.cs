using System;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using WasmerSharp;

/// Connector using WasmerSharp
/// https://github.com/migueldeicaza/WasmerSharp
public class ConnectorWasmerSharp : ConnectorAbstract
{

    private int id = -1;

    private static Instance wasmInstance = null;
    private static Sandbox SandboxInstance = null;
    private static int SandboxNextId = 0;
    private static IDictionary<int, Sandbox> SandboxIdMap = new Dictionary<int, Sandbox>();

    public ConnectorWasmerSharp(Sandbox sandbox)
    {
        SandboxInstance = sandbox;
        SandboxIdMap.Add(SandboxNextId, sandbox);
        this.id = SandboxNextId;
        SandboxNextId += 1;
    }

    static Sandbox GetSandbox()
    {
        return SandboxInstance;
    }

    public override void Load(int id, string url)
    {
        UnityWebRequest req = UnityWebRequest.Get(url);
        req.SendWebRequest().completed += operation =>
        {
            if (req.result != UnityWebRequest.Result.Success) {
                Debug.Log(req.error);
                GetSandbox().OnLoadCompleted(1);
                return;
            }
            var wasm = req.downloadHandler.data;
            var imports = CreateImports(id);
            wasmInstance = new Instance(wasm, imports);
            GetSandbox().OnLoadCompleted(0);
        };
    }

    private Import[] CreateImports(int id)
    {
        // This creates a memory block with a minimum of 256 64k pages
        // and a maxium of 256 64k pages
        var memory = Memory.Create(minPages: 256);

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

        Func<InstanceContext, int, int, int> execI_I = (context, funcId, i0) => {
            return ExecI_I(context, funcId, i0);
        };
        var execI_I_Import = new Import ("env", "execI_I", new ImportFunction (execI_I));

        Func<InstanceContext, int, int, int, int> execI_II = (context, funcId, i0, i1) => {
            return ExecI_II(context, funcId, i0, i1);
        };
        var execI_II_Import = new Import ("env", "execI_II", new ImportFunction (execI_II));

        Func<InstanceContext, int, int, int, int> execI_S = (context, funcId, i0, i1) => {
            return ExecI_S(context, funcId, i0, i1);
        };
        var execI_S_Import = new Import ("env", "execI_S", new ImportFunction (execI_S));

        Func<InstanceContext, int, int, float, float, float, int> execI_IV3 = (context, funcId, i0, f0, f1, f2) => {
            return ExecI_IV3(context, funcId, i0, f0, f1, f2);
        };
        var execI_IV3_Import = new Import ("env", "execI_IV3", new ImportFunction (execI_IV3));

        Func<InstanceContext, int, int, float, float, float, float, int> execI_IV4 = (context, funcId, i0, f0, f1, f2, f3) => {
            return ExecI_IV4(context, funcId, i0, f0, f1, f2, f3);
        };
        var execI_IV4_Import = new Import ("env", "execI_IV4", new ImportFunction (execI_IV4));
        
        var execV3_IFunc = new Import ("env", "execV3_I", new ImportFunction ((Func<InstanceContext, int, int, int>) (ExecV3_I)));

        Import[] imports = new Import[] {
            memoryImport,
            abortFunc,
            logIntFunc,
            logFloatFunc,
            logStringFunc,
            execI_I_Import,
            execI_II_Import,
            execI_S_Import,
            execI_IV3_Import,
            execI_IV4_Import,
            execV3_IFunc,
        };
        return imports;
    }

    public override int Start()
    {
        var result = wasmInstance.Call("start");
        return (int) result[0];
    }
    public override void Update()
    {
        wasmInstance.Call("update");
    }
    public override void SandboxExecV_II(int funcId, int i0, int i1)
    {
        wasmInstance.Call("sandboxExecV_II", funcId, i0, i1);
    }

    public override void SandboxExecV_I(int funcId, int loaderId)
    {
        wasmInstance.Call("sandboxExecV_I", funcId, loaderId);
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
    private void LogInt(InstanceContext ctx, int value)
    {
        Debug.Log("LogInt: " + value.ToString());
    }
    private void LogFloat(InstanceContext ctx, float value)
    {
        Debug.Log("LogFloat: " + value.ToString());
    }
    private void LogString(InstanceContext context, int ptr, int len)
    {
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + ptr, len);
            Debug.Log(str);
        }
    }
    private static int ExecI_I(InstanceContext context, int funcId, int i0)
    {
        return GetSandbox().ExecI_I(funcId, i0);
    }

    // To be renamed to ExecI_II_V
    private static int ExecI_II(InstanceContext context, int funcId, int i0, int i1)
    {
        return GetSandbox().ExecI_II(funcId, i0, i1);
    }

    private static int ExecI_S(InstanceContext context, int funcId, int strPtr, int len)
    {
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + strPtr, len);
        }
        return GetSandbox().ExecI_S(funcId, str);
    }

    private static int ExecI_IV3(InstanceContext context, int funcId, int i0, float f0, float f1, float f2)
    {
        return GetSandbox().ExecI_IV3(funcId, i0, f0, f1, f2);
    }

    private static int ExecI_IV4(InstanceContext context, int funcId, int i0, float f0, float f1, float f2, float f3)
    {
        return GetSandbox().ExecI_IV4(funcId, i0, f0, f1, f2, f3);
    }

    private int ExecV3_I(InstanceContext context, int funcId, int i0)
    {
        var v = GetSandbox().ExecV3_I(funcId, i0);
        if (v == null)
        {
            return -1;
        }
        else
        {
            unsafe
            {
                var ptr = (float*)context.GetMemory(0).Data;
                *ptr = v.Value.x;
                ptr++;
                *ptr = v.Value.y;
                ptr++;
                *ptr = v.Value.z;
                return 0;
            }
        }
    }
}
