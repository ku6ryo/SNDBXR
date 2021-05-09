using AOT;
using System.Runtime.InteropServices;
using UnityEngine;

public class ConnectorWebGL
{
    [DllImport("__Internal")]
    private static extern void JsInit(
        dlgConnect a,
        dlgGetObjectByName b,
        dlgSetObjectPosition c
    );

    [DllImport("__Internal")]
    private static extern int JsTest();

    [DllImport("__Internal")]
    private static extern int JsUpdate();

    private static ConnectorCore Core = null;

    public void Init(ConnectorCore core)
    {
        ConnectorWebGL.Core = core;
        JsInit(
            Connect,
            GetObjectByName,
            SetObjectPosition
        );
    }
    public void Test()
    {
        var val = JsTest();
        Debug.Log(val);
    }

    public void Update()
    {
        JsUpdate();
    }

    delegate void dlgConnect();

    [MonoPInvokeCallback(typeof(dlgConnect))]
    static void Connect()
    {
        Core.Connect();
    }

    delegate void dlgDisconnect();

    [MonoPInvokeCallback(typeof(dlgDisconnect))]
    static void Disconnect()
    {
        Core.Disconnect();
    }

    delegate int dlgGetObjectByName(string name);

    [MonoPInvokeCallback(typeof(dlgGetObjectByName))]
    static int GetObjectByName(string name)
    {
        return Core.GetObjectByName(name);
    }

    delegate int dlgSetObjectPosition(int objectId, float x, float y, float z);

    [MonoPInvokeCallback(typeof(dlgSetObjectPosition))]
    static int SetObjectPosition(int objectId, float x, float y, float z)
    {
        return Core.SetObjectPosition(objectId, x, y, z);
    }

    delegate int dlgSetObjectEventListenr(int objectId, int type);
    static int SetObjectEventListener(int objectId, int type)
    {
        return 1;
    }
}
