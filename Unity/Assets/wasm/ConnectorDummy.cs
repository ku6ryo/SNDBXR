using AOT;
using System;

public class ConnectorDummy : ConnectorAbstract
{
    private Sandbox sandbox = null;

    ConnectorDummy(Sandbox sandbox)
    {
        this.sandbox = sandbox;
    }
    public override void Load(string url, Action<bool> onComplete)
    {
        onComplete(true);
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
}
