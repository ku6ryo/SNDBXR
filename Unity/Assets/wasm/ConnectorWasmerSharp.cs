using System;
using System.Text;
using UnityEngine;
using WasmerSharp;

/// Connector using WasmerSharp
/// https://github.com/migueldeicaza/WasmerSharp
public class ConnectorWasmerSharp
{

    private Instance wasmInstance = null;
    private string sandboxName = null;

    int frames = 0;

    public ConnectorWasmerSharp(string sandboxName)
    {
        this.sandboxName = sandboxName;
    }

    Sandbox GetSandbox()
    {
        Debug.Log(this.sandboxName);
        return GameObject.Find(this.sandboxName).GetComponent<Sandbox>();
    }

    public void Load(byte[] wasm)
    {
        var imports = CreateImports();
        wasmInstance = new Instance (wasm, imports);
    }

    private Import[] CreateImports()
    {
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
        return imports;
    }

    public void Start()
    {
        wasmInstance.Call("start");
    }
    public void Update()
    {
        if (frames > 120) {
            wasmInstance.Call("update");
        } else {
            frames += 1;
        }
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
    private int ExecI_I(InstanceContext context, int funcId, int i0)
    {
            return GetSandbox().ExecI_I(funcId, i0);
    }

    // To be renamed to ExecI_II_V
    private int ExecI_II(InstanceContext context, int funcId, int i0, int i1)
    {
        return GetSandbox().ExecI_II_V(funcId, i0, i1, () => {
            Debug.Log("clicked22");
            wasmInstance.Call("onEvent", new object[]{ i0, i1 });
        });
    }

    private int ExecI_S(InstanceContext context, int funcId, int strPtr, int len)
    {
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + strPtr, len);
        }
        return GetSandbox().ExecI_S(funcId, str);
    }
    private int ExecI_IV3(InstanceContext context, int funcId, int i0, float f0, float f1, float f2)
    {
        return GetSandbox().ExecI_IV3(funcId, i0, f0, f1, f2);
    }
    private int ExecI_IV4(InstanceContext context, int funcId, int i0, float f0, float f1, float f2, float f3)
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
