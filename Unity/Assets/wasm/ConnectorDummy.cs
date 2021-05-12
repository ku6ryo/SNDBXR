using AOT;
using System.Runtime.InteropServices;
using UnityEngine;

public class ConnectorDummy
{
    private static Sandbox Core = null;

    public void Init(Sandbox core)
    {
        ConnectorDummy.Core = core;
        core.Connect();
    }
    public void Test()
    {
    }

    public void Update()
    {
        Debug.Log("Dummy: Update");
    }
}
