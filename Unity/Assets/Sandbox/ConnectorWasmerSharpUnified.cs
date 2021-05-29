using System;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
using WasmerSharp;

/// Connector using WasmerSharp
/// https://github.com/migueldeicaza/WasmerSharp
public class ConnectorWasmerSharpUnified : ConnectorAbstract
{
    private int id = -1;

    private static Instance wasmInstance = null;
    private static Sandbox SandboxInstance = null;
    private static int SandboxNextId = 0;
    private static IDictionary<int, Sandbox> SandboxIdMap = new Dictionary<int, Sandbox>();

    public ConnectorWasmerSharpUnified(Sandbox sandbox)
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

    private static Import[] CreateImports(int sandboxId)
    {
        // This creates a memory block with a minimum of 256 64k pages
        // and a maxium of 256 64k pages
        var memory = Memory.Create(minPages: 256);
        unsafe {
            var ptr = (int*) memory.Data;
            *ptr = sandboxId;
        }

        // Now we surface the memory as an import
        var memoryImport = new Import ("env", "memory", memory);

        var abortFunc = new Import ("env", "abort", 
                new ImportFunction ((Action<InstanceContext,int,int,int,int>) (Abort)));
        var logIntFunc = new Import ("debug", "logInt",
                new ImportFunction ((Action<InstanceContext, int>) (LogInt)));
        var logFloatFunc = new Import ("debug", "logFloat",
                new ImportFunction ((Action<InstanceContext, float>) (LogFloat)));
        var logStringFunc = new Import ("debug", "logString",
                new ImportFunction ((Action<InstanceContext, int, int>) (LogString)));
        var callEngine32Func = new Import ("proto", "_callEngine32",
                new ImportFunction ((Action<InstanceContext, int, int, int, int>) (CallEngine32)));

        Import[] imports = new Import[] {
            memoryImport,
            abortFunc,
            logIntFunc,
            logFloatFunc,
            logStringFunc,
            callEngine32Func,
        };
        return imports;
    }

    public override int Start(int sandboxId)
    {
        var result = wasmInstance.Call("start");
        return 0;
    }
    public override void Update(int sandboxId)
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

    private static void CallEngine32(InstanceContext context, int ptr, int pOut, int unitLength, int funcId)
    {
        if (funcId == 1001) {
            GetSandbox().ExecI_I(funcId, 0);
        }
        /*
        var v = GetSandbox().ExecV3_I(funcId, i0);
        unsafe
        {
            // Bad implementaion, to be fixed.
            var ptr = (float*) context.GetMemory(0).Data;
            *ptr = v.x;
            ptr++;
            *ptr = v.y;
            ptr++;
            *ptr = v.z;
            return 0;
        }
        */
    }
}
