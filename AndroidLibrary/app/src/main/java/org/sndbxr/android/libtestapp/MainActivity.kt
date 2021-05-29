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

    companion object {
        // Used to load the 'native-lib' library on application startup.
        init {
            System.loadLibrary("native-lib")
        }
    }

    private fun fetchAndRun() {
        val executor = Executors.newSingleThreadExecutor()
        executor.execute {
            val url = "http://192.168.1.5:8080/915a89d2-93cb-4d90-9c8d-3d8ad80310f0.wasm"
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