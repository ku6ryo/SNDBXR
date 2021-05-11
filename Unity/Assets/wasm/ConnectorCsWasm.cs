using UnityEngine;
using System.IO;
using UnityEngine.Networking;
using System.Collections.Generic;
using Wasm;
using Wasm.Interpret;
using System.Text;

public class ConnectorCsWasm
{
    const int GET_OBJECT_ID_BY_NAME = 0;
    const int SET_OBJECT_POSITION = 1;

    private ConnectorCore Core = null;
    private ModuleInstance wasmModule = null;


    public void Init(ConnectorCore core)
    {
        this.Core = core;

        string url = "http://192.168.1.5:8080/scripting/build/untouched.wasm";
        UnityWebRequest req = UnityWebRequest.Get(url);
        req.SendWebRequest().completed += operation =>
        {
            MemoryStream stream = new MemoryStream();
            stream.Write(req.downloadHandler.data, 0, req.downloadHandler.data.Length);
            stream.Seek(0, SeekOrigin.Begin);
            this.wasmModule = this.CreateModule(stream);

            if (this.wasmModule.ExportedFunctions.TryGetValue("Test", out FunctionDefinition funcDef))
            {
                IReadOnlyList<object> results = funcDef.Invoke(new object[] {});
                Debug.Log(results[0]);
            }
        };
    }

    private ModuleInstance CreateModule(Stream stream)
    {
        var importer = new NamespacedImporter(); 
        var envImporter = new PredefinedImporter();
        envImporter.DefineFunction(
            "abort",
            new DelegateFunctionDefinition(
                new WasmValueType[] { WasmValueType.Int32, WasmValueType.Int32, WasmValueType.Int32, WasmValueType.Int32 },
                new WasmValueType[] {},
                Abort
            )
        );
        envImporter.DefineFunction(
            "logInt",
            new DelegateFunctionDefinition(
                new WasmValueType[] { WasmValueType.Int32 },
                new WasmValueType[] {},
                LogInt
            )
        );
        envImporter.DefineFunction(
            "execIS",
            new DelegateFunctionDefinition(
                new WasmValueType[] { WasmValueType.Int32, WasmValueType.Int32, },
                new [] { WasmValueType.Int32, },
                ExecIS
            )
        );
        envImporter.DefineFunction(
            "execIIV3",
            new DelegateFunctionDefinition(
                new WasmValueType[] { WasmValueType.Int32, WasmValueType.Int32, },
                new [] { WasmValueType.Int32, },
                ExecIS
            )
        );
        importer.RegisterImporter("env", envImporter);
        var file = Wasm.WasmFile.ReadBinary(stream);
        ModuleInstance module = ModuleInstance.Instantiate(file, importer);
        return module;
    }

    private IReadOnlyList<object> Abort(IReadOnlyList<object> args)
    {
        uint messagePtr = (uint) (int) args[0];
        uint fileNamePtr = (uint) (int) args[1];
        int lineNumber = (int) args[2];
        int columnNumber = (int) args[3];
        Debug.Log("Abort");
        Debug.Log(messagePtr);
        Debug.Log(lineNumber);
        Debug.Log(columnNumber);
        var en = this.wasmModule.Memories.GetEnumerator();
        int i = 0;
        while (en.MoveNext()) {
            i += 1;
        }
        Debug.Log(i);
        LinearMemory m = this.wasmModule.Memories[0];
        byte[] bytes = new byte[150];
      for (uint j = 0; j < 150; j ++) {
            bytes[j] = (byte) m.Int32[fileNamePtr + j];
            Debug.Log(bytes[j]);
        }
        Debug.Log(Encoding.Default.GetString(bytes));
        return new object[] {};
    }
    private IReadOnlyList<object> LogInt(IReadOnlyList<object> args)
    {
        int value = (int) args[0];
        Debug.Log("LogInt: " + value.ToString());
        return new object[] {};
    }
    private IReadOnlyList<object> ExecII(IReadOnlyList<object> args)
    {
        int funcId = (int) args[0];
        int arg1 = (int) args[1];
        int arg2 = (int) args[1];
        switch(funcId)
        {
            default:
                throw new System.Exception("No function to match");
        }
    }

    private IReadOnlyList<object> ExecIS(IReadOnlyList<object> args)
    {
        int funcId = (int) args[0];
        int strPtr = (int) args[1];

        switch(funcId)
        {
            case GET_OBJECT_ID_BY_NAME:
                return new object[] { this.Core.GetObjectByName("Cube") };
            default:
                throw new System.Exception("No function to match");
        }
    }
    private IReadOnlyList<object> ExecIIV3(IReadOnlyList<object> args)
    {
        int funcId = (int) args[0];
        int objectId = (int) args[1];
        float x = (float) args[2];
        float y = (float) args[3];
        float z = (float) args[4];
        switch(funcId)
        {
            case SET_OBJECT_POSITION:
                return new object[] { this.Core.SetObjectPosition(objectId, x, y, z) };
            default:
                throw new System.Exception("No function to match");
        }
    }
 
    public void Test()
    {
    }

    public void Update()
    {
    }

    public void Connect()
    {
        this.Core.Connect();
    }

    public void Disconnect()
    {
        this.Core.Disconnect();
    }
}