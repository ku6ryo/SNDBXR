using AOT;
using System.Runtime.InteropServices;
using UnityEngine;

public class ConnectorWebGL
{
    [DllImport("__Internal")]
    private static extern void JsInit(
        dlgGetObjectByName a,
        dlgSetObjectPosition b
    );

    [DllImport("__Internal")]
    private static extern int JsTest();

    [DllImport("__Internal")]
    private static extern int JsUpdate();

    private static ConnectorCore Core = null;

    public void Init(ConnectorCore core)
    {
        ConnectorWebGL.Core = core;
        JsInit(GetObjectByName, SetObjectPosition);
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

    delegate int dlgGetObjectByName();

    [MonoPInvokeCallback(typeof(dlgGetObjectByName))]
    static int GetObjectByName()
    {
        return Core.GetObjectByName("Cube");
    }

    delegate int dlgSetObjectPosition(int objectId, float x, float y, float z);

    [MonoPInvokeCallback(typeof(dlgSetObjectPosition))]
    static int SetObjectPosition(int objectId, float x, float y, float z)
    {
        Debug.Log(objectId);
        Debug.Log(x);
        Debug.Log(y);
        Debug.Log(z);
        return Core.SetObjectPosition(objectId, x, y, z);
    }

    delegate int dlgSetObjectEventListenr(int objectId, int type);
    static int SetObjectEventListener(int objectId, int type)
    {
        return 1;
    }
}
