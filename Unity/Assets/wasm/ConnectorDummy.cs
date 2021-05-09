using AOT;
using System.Runtime.InteropServices;
using UnityEngine;

public class ConnectorDummy
{
    private static ConnectorCore Core = null;

    public void Init(ConnectorCore core)
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
