package org.sndbxr.android.lib

import android.util.Log
import androidx.annotation.Keep
import java.lang.Exception

class WasmSandbox constructor(wasmBytes: ByteArray) {

    val TAG = "SNDBXR/WasmSandbox"
    val wasmBytes: ByteArray
    private var nextCallId: Int = 0
    private var callMap: MutableMap<Int, Call32> = mutableMapOf()
    private var onCallEngine32: OnCallEngine32? = null

    init {
       this.wasmBytes = wasmBytes
    }

    companion object {
        // Used to load the 'native-lib' library on application startup.
        init {
            System.loadLibrary("native-lib")
        }
    }

    fun run() {
        Log.d(TAG, "WASM bytes: " + Integer.toString(wasmBytes.size))
        runWasm(wasmBytes, wasmBytes.size)
    }

    fun update() {
        updateWasm()
    }

    // Native functions
    external fun runWasm(wasm: ByteArray?, len: Int): Int
    external fun updateWasm(): Int

    @Keep
    fun log(str: String) {
        Log.d(TAG, str)
    }

    @Keep
    fun callEngine32(callId: Int) {
        val call = callMap[callId]
        if (call != null) {
            this.onCallEngine32?.run {
                onCall(call)
            }
        } else {
            throw Exception("no call")
        }
    }
    @Keep
    fun trashCall(callId: Int) {
       callMap.remove(callId)
    }
    @Keep
    fun createCall(numArgs: Int, numReturns: Int, funcId: Int): Int {
        val call = Call32(numArgs, numReturns, funcId)
        val id = nextCallId
        callMap[id] = call
        nextCallId++;
        return id;
    }
    @Keep
    fun setCallArgInt(callId: Int, index: Int, value: Int) {
        val call = callMap[callId]
        if (call != null) {
            call.setArgInt(index, value)
        }
    }
    @Keep
    fun setCallArgFloat(callId: Int, index: Int, value: Float) {
        val call = callMap[callId]
        if (call != null) {
            call.setArgFloat(index, value)
        }
    }
    @Keep
    fun getCallArgInt(callId: Int, index: Int): Int {
        val call = callMap[callId]
        if (call != null) {
            return call.getArgInt(index)
        }
        throw Exception("no call")
    }
    @Keep
    fun getCallArgFloat(callId: Int, index: Int): Float {
        val call = callMap[callId]
        if (call != null) {
            return call.getArgFloat(index)
        }
        throw Exception("no call")
    }
    @Keep
    fun getCallReturnInt(callId: Int, index: Int): Int {
        val call = callMap[callId]
        if (call != null) {
            return call.getReturnInt(index)
        }
        throw Exception("no session found.")
    }
    @Keep
    fun getCallReturnFloat(callId: Int, index: Int): Float {
        val call = callMap[callId]
        if (call != null) {
            return call.getReturnFloat(index)
        }
        throw Exception("no session found.")
    }
	@Keep
	fun setCallReturnInt(callId: Int, index: Int, value: Int) {
		val call = callMap[callId]
		if (call != null) {
			call.setReturnInt(index, value)
		}
	}
	@Keep
	fun setCallReturnFloat(callId: Int, index: Int, value: Float) {
		val call = callMap[callId]
		if (call != null) {
			call.setReturnFloat(index, value)
		}
	}

	fun setOnCallEngine32(callback: OnCallEngine32) {
		this.onCallEngine32 = callback
    }

    class Call32(numArgs: Int, numReturns: Int, private val funcId: Int) {
        private val returnValues: MutableList<ValuePack> = mutableListOf()
        private val argValues: MutableList<ValuePack> = mutableListOf()

        init {
            for (i in 0..numArgs - 1) {
                argValues.add(ValuePack())
            }
            for (i in 0..numReturns - 1) {
                returnValues.add(ValuePack())
            }
        }

        fun getFuncId(): Int {
           return this.funcId
        }

		fun getNumArgs(): Int {
			return argValues.size;
		}

		fun getArg(index: Int): ValuePack {
			val vp = this.argValues[index]
			if (vp != null) {
				return vp
			} else {
				throw Exception("index out of value range")
			}
		}

		fun getReturn(index: Int): ValuePack {
			val vp = this.returnValues[index]
			if (vp != null) {
				return vp
			} else {
				throw Exception("index out of value range")
			}
		}

		fun getArgType(index: Int): Int {
			val vp = this.argValues[index]
			if (vp != null) {
				return vp.getType()
			} else {
				throw Exception("index out of value range")
			}
		}

		fun getReturnType(index: Int): Int {
			val vp = this.returnValues[index]
			if (vp != null) {
				return vp.getType()
			} else {
				throw Exception("index out of value range")
			}
		}

		fun getNumReturns(): Int {
			return returnValues.size;
		}

        fun setReturnInt(index: Int, value: Int) {
            val vp = this.returnValues[index]
            if (vp != null) {
                vp.setInt(value)
            } else {
                throw Exception("index out of value range")
            }
        }
        fun getReturnInt(index: Int): Int {
            val vp = this.returnValues[index]
            if (vp != null) {
                return vp.getInt()
            } else {
                throw Exception("index out of value range")
            }
        }

        fun setReturnFloat(index: Int, value: Float) {
            val vp = this.returnValues[index]
            if (vp != null) {
                vp.setFloat(value)
            } else {
                throw Exception("index out of value range")
            }
        }

        fun getReturnFloat(index: Int): Float {
            val vp = this.returnValues[index]
            if (vp != null) {
                return vp.getFloat()
            } else {
                throw Exception("index out of value range")
            }
        }

        fun setArgInt(index: Int, value: Int) {
            val vp = this.argValues[index]
            if (vp != null) {
                vp.setInt(value)
            } else {
                throw Exception("index out of value range")
            }
        }

        fun setArgFloat(index: Int, value: Float) {
            val vp = this.argValues[index]
            if (vp != null) {
                vp.setFloat(value)
            } else {
                throw Exception("index out of value range")
            }
        }

        fun getArgInt(index: Int): Int {
            val vp = this.argValues[index]
            if (vp != null) {
                return vp.getInt()
            } else {
                throw Exception("index out of value range")
            }
        }

        fun getArgFloat(index: Int): Float {
            val vp = this.argValues[index]
            if (vp != null) {
                return vp.getFloat()
            } else {
                throw Exception("index out of value range")
            }
        }
    }

    class ValuePack {
        private var i32: Int = 0;
        private var f32: Float = 0f;
		private var type: Int = 0;

		fun getType(): Int {
			return type
		}

        fun setInt(value: Int) {
			type = 1
            i32 = value
        }

        fun setFloat(value: Float) {
			type = 2
            f32 = value
        }

        fun getInt(): Int {
            return i32
        }

        fun getFloat(): Float {
            return f32
        }
    }
}
