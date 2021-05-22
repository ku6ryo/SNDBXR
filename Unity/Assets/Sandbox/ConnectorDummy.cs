using AOT;
using System;

public class ConnectorDummy : ConnectorAbstract
{
    private Sandbox sandbox = null;

    ConnectorDummy(Sandbox sandbox)
    {
        this.sandbox = sandbox;
    }
    public override void Load(int id, string url)
    {
    }
    public void Init()
    {
    }
    public void Test()
    {
    }
    public override int Start()
    {
        return 0;
    }
    public override void Update()
    {
    }
    public override void SandboxExecV_II(int funcId, int i0, int i1)
    {
    }
    public override void SandboxExecV_I(int funcId, int loaderId)
    {
    }
}
