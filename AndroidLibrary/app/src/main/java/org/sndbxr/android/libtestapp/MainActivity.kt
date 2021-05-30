package org.sndbxr.android.libtestapp

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.libtestapp.databinding.ActivityMainBinding
import com.squareup.okhttp.OkHttpClient
import com.squareup.okhttp.Request
import java.util.concurrent.Executors
import org.sndbxr.android.lib.WasmSandbox
import org.sndbxr.android.lib.OnCallEngine32
import java.util.*

class MainActivity : AppCompatActivity() {

    val TAG = "MainActivity"

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        fetchAndRun()
    }

    private fun fetchAndRun() {
        val executor = Executors.newSingleThreadExecutor()
        executor.execute {
			// Change depending on your environment and wasm file.
            val url = "http://192.168.1.5:8080/artifacts/5593bdc2-9f28-4d52-848b-d41163f94273.wasm"
            val client = OkHttpClient()
            val request = Request.Builder().url(url).build()
            val response = client.newCall(request).execute()
            val wasmBytes: ByteArray = response.body().bytes()
            val sandbox = WasmSandbox(wasmBytes)
            with(sandbox) {
                setOnCallEngine32(OnCallEngine32Custom())
                run()
                update()
                update()
                update()
                update()
                update()
            }
        }
    }

    class OnCallEngine32Custom : OnCallEngine32 {
        override fun onCall(call: WasmSandbox.Call32) {
            Log.d("SNDBXR", "onCall" + call.getFuncId().toString())
            val f = call.getFuncId()
            if (f == 1001) {
                call.setReturnInt(0, 100)
            }
        }
    }
}
