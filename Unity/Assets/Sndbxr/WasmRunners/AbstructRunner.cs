
namespace Sndbxr
{
    public abstract class AbstractRunner
    {
        public abstract void Load(int id, string url);
        public abstract int Start(int sandboxId);
        public abstract void Update(int sandboxId);
    }
}