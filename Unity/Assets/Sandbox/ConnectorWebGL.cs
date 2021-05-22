#if UNITY_WEBGL
using AOT;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

public class ConnectorWebGL : ConnectorAbstract
{
    private static Sandbox SandboxInstance = null;

    public ConnectorWebGL(Sandbox sandbox)
    {
        SandboxInstance = sandbox;
    }

    static Sandbox GetSandbox()
    {
        return SandboxInstance;
    }

    public static void WebGLInit()
    {
        JsInit();
        ConnectExecI_I(ExecI_I);
        ConnectExecI_II(ExecI_II);
        ConnectExecI_S(ExecI_S);
        ConnectExecI_IV3(ExecI_IV3);
        ConnectExecI_IV4(ExecI_IV4);
        ConnectExecV3_I(ExecV3_I);
        ConnectOnLoadCompleted(OnLoadCompleted);
    }

    public void Init()
    {
    }
    [DllImport("__Internal")]
    private static extern int JsInit();

    public override void Update()
    {
        JsUpdate();
    }
    [DllImport("__Internal")]
    private static extern int JsUpdate();

    public override int Start(int sandboxId)
    {
        JsStart(sandboxId);
        return 0;
    }
    [DllImport("__Internal")]
    private static extern int JsStart(int sandboxId);

    public override void Load(int id, string url)
    {
        var result = JsLoad(id, url);
    }
    [DllImport("__Internal")]
    private static extern int JsLoad(int id, string url);

    delegate void dlgOnLoadCompleted(int id, int status);
    [MonoPInvokeCallback(typeof(dlgOnLoadCompleted))]
    private static void OnLoadCompleted(int id, int status)
    {
        GetSandbox().OnLoadCompleted(status);
    }
    [DllImport("__Internal")]
    private static extern int ConnectOnLoadCompleted(dlgOnLoadCompleted ptr);

    public override void SandboxExecV_II(int funcId, int i0, int i1)
    {
        JsSandboxExecV_II(funcId, i0, i1);
    }
    [DllImport("__Internal")]
    private static extern int JsSandboxExecV_II(int funcId, int i0, int i1);

    public override void SandboxExecV_I(int funcId, int i0)
    {
        JsSandboxExecV_I(funcId, i0);
    }
    [DllImport("__Internal")]
    private static extern int JsSandboxExecV_I(int funcId, int i0);

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

    delegate float[] dlgExecV3_I(int funcId, int i0);
    [MonoPInvokeCallback(typeof(dlgExecV3_I))]
    private static float[] ExecV3_I(int funcId, int i0)
    {
        var v = GetSandbox().ExecV3_I(funcId, i0);
        var fArray = new float[3];
        fArray[0] = v.x;
        fArray[1] = v.y;
        fArray[2] = v.x;
        return fArray;
    }
    [DllImport("__Internal")]
    private static extern int ConnectExecV3_I(dlgExecV3_I ptr);
}
#endif