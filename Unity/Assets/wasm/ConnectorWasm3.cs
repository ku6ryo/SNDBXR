using System;
using System.Text;
using UnityEngine;
using System.Collections.Generic;
using Wasm3DotNet;
using Wasm3DotNet.Wrapper;


/// Connector using Wasm3DotNet
/// https://github.com/tana/Wasm3DotNet
public class ConnectorWasm3
{
    private int id = -1;
    private static Sandbox SandboxInstance = null;
    private static int SandboxNextId = 0;
    private static IDictionary<int, Sandbox> SandboxIdMap = new Dictionary<int, Sandbox>();

    private static Runtime runtime = null;

    public ConnectorWasm3(Sandbox sandbox)
    {
        SandboxInstance = sandbox;
        SandboxIdMap.Add(SandboxNextId, sandbox);
        this.id = SandboxNextId;
        SandboxNextId += 1;
    }

    static Sandbox GetSandbox()
    {
        return SandboxInstance;
        // return SandboxIdMap[id];
    }

    public void Load(byte[] wasm)
    {
        using (var environment = new Wasm3DotNet.Wrapper.Environment())
        {
            runtime = new Runtime(environment);
            runtime.PrintRuntimeInfo();
            var module = runtime.ParseModule(wasm);

            runtime.LoadModule(module);

            module.LinkRawFunction("env", "abort", "v(iii)", Abort);
            module.LinkRawFunction("env", "logInt", "v(i)", LogInt);
            module.LinkRawFunction("env", "logFloat", "v(f)", LogFloat);
            module.LinkRawFunction("env", "logString", "v(ii)", LogString);
        }
    }

    public void Start()
    {
        var func = runtime.FindFunction("start");
        func.Call(10);
    }
    public void Update()
    {
    }

    static IntPtr Abort (IntPtr runtime, IntPtr paramPtr, IntPtr memPtr)
    {
        Debug.Log("Abort");
        return IntPtr.Zero;
    }
    static IntPtr LogInt (IntPtr runtime, IntPtr paramPtr, IntPtr memPtr)
    {
        /*
        Debug.Log("LogInt: " + value.ToString());
        */
        return IntPtr.Zero;
    }
    static IntPtr LogFloat (IntPtr runtime, IntPtr paramPtr, IntPtr memPtr)
    {
        // Debug.Log("LogFloat: " + value.ToString());
        return IntPtr.Zero;
    }
    private IntPtr LogString(IntPtr runtime, IntPtr paramPtr, IntPtr memPtr)
    {
        /*
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + ptr, len);
            Debug.Log(str);
        }
        */
        return IntPtr.Zero;
    }

    /**
    private static int ExecI_I(InstanceContext context, int funcId, int i0)
    {
        return GetSandbox().ExecI_I(funcId, i0);
    }

    // To be renamed to ExecI_II_V
    private static int ExecI_II(InstanceContext context, int funcId, int i0, int i1)
    {
        return GetSandbox().ExecI_II_V(funcId, i0, i1, () => {
            Debug.Log("clicked22");
            wasmInstance.Call("onEvent", new object[]{ i0, i1 });
        });
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
    */
}
