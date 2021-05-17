#if UNITY_WEBGL
using AOT;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

public class ConnectorWebGL : ConnectorAbstract
{
    private int id;
    private static Sandbox SandboxInstance = null;
    private static int SandboxNextId = 0;
    private static IDictionary<int, Sandbox> SandboxIdMap = new Dictionary<int, Sandbox>();

    public ConnectorWebGL(Sandbox sandbox)
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

    [DllImport("__Internal")]
    private static extern int JsTest();


    public void Init()
    {
        JsInit();
        ConnectExecI_I(ExecI_I);
        ConnectExecI_II(ExecI_II);
        ConnectExecI_S(ExecI_S);
        ConnectExecI_IV3(ExecI_IV3);
        ConnectExecI_IV4(ExecI_IV4);
        ConnectExecV3_I(ExecV3_I);
    }
    [DllImport("__Internal")]
    private static extern int JsInit();

    public void Test()
    {
        var val = JsTest();
        Debug.Log(val);
    }

    public override void Update()
    {
        JsUpdate();
    }
    [DllImport("__Internal")]
    private static extern int JsUpdate();

    public override int Start()
    {
        JsStart();
        return 0;
    }
    [DllImport("__Internal")]
    private static extern int JsStart();
    public override void Load(string url, Action<bool> onComplete)
    {
        Init();
        JsLoad(url);
    }
    [DllImport("__Internal")]
    private static extern int JsLoad(string url);
    public override void SandboxExecV_II(int funcId, int i0, int i1)
    {
        // wasmInstance.Call("sandboxExecV_I", funcId, i0, i1);
    }

    public override void SandboxExecV_I(int funcId, int loaderId)
    {
        // wasmInstance.Call("sandboxExecV_I", funcId, loaderId);
    }

    delegate int dlgExecI_I(int funcId, int i0);
    [MonoPInvokeCallback(typeof(dlgExecI_I))]
    private static int ExecI_I(int funcId, int i0)
    {
        return GetSandbox().ExecI_I(funcId, i0);
    }
    [DllImport("__Internal")]
    private static extern int ConnectExecI_I(dlgExecI_I ptr);

    delegate int dlgExecI_II(int funcId, int i0, int i1);
    [MonoPInvokeCallback(typeof(dlgExecI_II))]
    private static int ExecI_II(int funcId, int i0, int i1)
    {
        return GetSandbox().ExecI_II(funcId, i0, i1);
    }
    [DllImport("__Internal")]
    private static extern int ConnectExecI_II(dlgExecI_II ptr);

    delegate int dlgExecI_S(int funcId, string str);
    [MonoPInvokeCallback(typeof(dlgExecI_S))]
    private static int ExecI_S(int funcId, string str)
    {
        return GetSandbox().ExecI_S(funcId, str);
    }
    [DllImport("__Internal")]
    private static extern int ConnectExecI_S(dlgExecI_S ptr);

    delegate int dlgExecI_IV3(int funcId, int i0, float f0, float f1, float f2);
    [MonoPInvokeCallback(typeof(dlgExecI_IV3))]
    private static int ExecI_IV3(int funcId, int i0, float f0, float f1, float f2)
    {
        return GetSandbox().ExecI_IV3(funcId, i0, f0, f1, f2);
    }
    [DllImport("__Internal")]
    private static extern int ConnectExecI_IV3(dlgExecI_IV3 ptr);

    delegate int dlgExecI_IV4(int funcId, int i0, float f0, float f1, float f2, float f3);
    [MonoPInvokeCallback(typeof(dlgExecI_IV4))]
    private static int ExecI_IV4(int funcId, int i0, float f0, float f1, float f2, float f3)
    {
        return GetSandbox().ExecI_IV4(funcId, i0, f0, f1, f2, f3);
    }
    [DllImport("__Internal")]
    private static extern int ConnectExecI_IV4(dlgExecI_IV4 ptr);

    delegate int dlgExecV3_I(int funcId, int i0);
    [MonoPInvokeCallback(typeof(dlgExecV3_I))]
    private static int ExecV3_I(int funcId, int i0)
    {
        var v = GetSandbox().ExecV3_I(funcId, i0);
        // TODO pass vector3 to web
        return 0;
    }
    [DllImport("__Internal")]
    private static extern int ConnectExecV3_I(dlgExecV3_I ptr);
}
#endif