using System;
public abstract class ConnectorAbstract
{
    public abstract void Load(string url, Action<bool> onComplete);
    public abstract int Start();
    public abstract void Update();
    public abstract void SandboxExecV_I(int funcId, int i0);
    public abstract void SandboxExecV_II(int funcId, int i0, int i1);
}
