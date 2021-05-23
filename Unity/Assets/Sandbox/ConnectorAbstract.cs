using System;
public abstract class ConnectorAbstract
{
    public abstract void Load(int id, string url);
    public abstract int Start(int sandboxId);
    public abstract void Update(int sandboxId);
    public abstract void SandboxExecV_I(int funcId, int i0);
    public abstract void SandboxExecV_II(int funcId, int i0, int i1);
}
