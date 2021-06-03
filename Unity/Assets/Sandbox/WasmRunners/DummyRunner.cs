
namespace Sndbxr
{
    public class DummyRunner : AbstractRunner
    {
        private Sandbox sandbox = null;

        DummyRunner(Sandbox sandbox)
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
        public override int Start(int sandboxId)
        {
            return 0;
        }
        public override void Update(int sandboxId)
        {
        }
    }
}