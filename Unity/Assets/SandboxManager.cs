using UnityEngine;

public class SandboxManager: MonoBehaviour {
    public void Start ()
    {
        var uuid = System.Guid.NewGuid().ToString();
        var sandbox = new GameObject(string.Format("sandbox_{0}", uuid));
        // sandbox.AddComponent<Sandbox>();
    }
}