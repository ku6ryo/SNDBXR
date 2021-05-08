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

    delegate int dlgGetObjectByName();

    [MonoPInvokeCallback(typeof(dlgGetObjectByName))]
    static int GetObjectByName()
    {
        return Core.GetObjectByName("Cube");
    }

    delegate int dlgSetObjectPosition(int objectId, int x, int y, int z);

    [MonoPInvokeCallback(typeof(dlgSetObjectPosition))]
    static int SetObjectPosition(int objectId, int x, int y, int z)
    {
        return Core.SetObjectPosition(objectId, x, y, z);
    }

    delegate int dlgSetObjectEventListenr(int objectId, int type);
    static int SetObjectEventListener(int objectId, int type)
    {
        return Core.SetObjectEventListener();
    }
}
