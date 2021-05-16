using System;
public abstract class ConnectorAbstract
{
    public abstract void Load(string url, Action<bool> onComplete);
    public abstract int Start();
    public abstract void Update();
}
