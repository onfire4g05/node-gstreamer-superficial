declare module "gstreamer-superficial" {
	type AppSinkCallback = (buffer: Buffer, caps: any) => void

	type AppSink = {
		pull: (callback: AppSinkCallback) => void

	}

	type AppSrc = {

	}

	type GObject = any

	class Pipeline {
		/**
		 * Creates a new GStreamer pipeline using the launch string provided
		 *
		 * @param launch The gstreamer launch pipeline text
		 *
		 * @example
		 * const pipeline = new gstreamer.Pipeline(
		 *  PipelineFromArray([
		 *   "videotestsrc pattern=ball",
		 *   "video/x-raw,width=320,height=240,framerate=100/1",
		 *   "theoraenc",
		 *   "oggmux",
		 *   "appsink max-buffers=1 name=sink"
		 * ])
		 * );
		 */
		constructor(launch: string);

		/**
		 * sets the pipeline state to `GST_STATE_PLAYING`
		 */
		play(): void;
		/**
		 * sets the pipeline state to GST_STATE_PAUSED
		 */
		stop(): void;
		sendEOS(): void;
		/**
		 * sets the pipeline state to GST_STATE_PAUSED
		 */
		pause(): void;

		/**
		 * Sends a seek event to an element. See gst_event_new_seek for the details of the parameters. The seek event is sent to the element using gst_element_send_event.
		 * @param seconds time in seconds or ms if useMs is true
		 * @param flags
		 * @returns TRUE if the event was handled. Flushing seeks will trigger a preroll, which will emit GST_MESSAGE_ASYNC_DONE.
		 */
		seek(seconds: number, flags: GstSeekFlags, useMs?: boolean): boolean

		/**
		 * Queries an element (usually top-level pipeline or playbin element) for the stream position in seconds.
		 * This will be a value between 0 and the stream duration (if the stream duration is known). This query will usually only work
		 * once the pipeline is prerolled (i.e. reached PAUSED or PLAYING state). The application will receive an ASYNC_DONE message on
		 * the pipeline bus when that is the case.
		 */
		queryPosition(useMs?: boolean): number

		/**
		 * Queries an element (usually top-level pipeline or playbin element) for the total stream duration in seconds.
		 * This query will only work once the pipeline is prerolled (i.e. reached PAUSED or PLAYING state).
		 * The application will receive an ASYNC_DONE message on the pipeline bus when that is the case.
		 * If the duration changes for some reason, you will get a DURATION_CHANGED message on the pipeline bus,
		 * in which case you should re-query the duration using this function.
		 */
		queryDuration(useMs?: boolean): number

		/**
		 * Creates a new upstream force key unit event. An upstream force key unit event can be sent to request upstream elements to produce a key unit.
		 * This is different from GST in that the params sent are: GST_CLOCK_TIME_NONE, TRUE, cnt; upstream elements will produce a new key unit as soon as possible.
		 * @param sink
		 * @param count integer that can be used to number key units
		 */
		forceKeyUnit(sink: GObject, count: number): true

		/**
		 * Gets the element with the given name from a bin. This function recurses into child bins.
		 * @param nodeName
		 */
		findChild(nodeName: string): GObject | AppSink | AppSrc

		/**
		 *
		 */
		setPad(element: GObject, attribute: string, padName: string): void

		/**
		 * Retrieves a pad from element by name. This version only retrieves already-existing (i.e. 'static') pads.
		 * @param element
		 * @param padName
		 */
		getPad(element: GObject, padName: string): GObject

		pollBus(callback: (message: GstMessageGeneric) => void): void

		rate(speed: number, flags: GstSeekFlags): boolean

		quit(): void
	}

	enum GstSeekFlags {
		/** No flag */
		NONE = 0,
		/** flush pipeline 1 */
		FLUSH = 1 << 0,
		/** accurate position is requested, this might be considerably slower for some formats. 2 */
		ACCURATE = 1 << 1,
		/** seek to the nearest keyframe. This might be faster but less accurate. 4 */
		KEY_UNIT = 1 << 2,
		/** perform a segment seek. 8 */
		SEGMENT = 1 << 3,
		/** when doing fast forward or fast reverse playback, allow elements to skip frames instead of generating all frames. (Since: 1.6) */
		TRICKMODE = 1 << 4,
		/** go to a location before the requested position, if KEY_UNIT this means the keyframe at or before the requested position the one at or before the seek target. */
		SNAP_BEFORE = 1 << 5,
		/** go to a location after the requested position, if KEY_UNIT this means the keyframe at of after the requested position. */
		SNAP_AFTER = 1 << 6,
		/** when doing fast forward or fast reverse playback, request that elements only decode keyframes and skip all other content, for formats that have keyframes. (Since: 1.6) */
		TRICKMODE_KEY_UNITS = 1 << 7,
		/** when doing fast forward or fast reverse playback, request that audio decoder elements skip decoding and output only gap events or silence. (Since: 1.6) */
		TRICKMODE_NO_AUDIO = 1 << 8,
		/** When doing fast forward or fast reverse playback, request that elements only decode keyframes and forward predicted frames and skip all other content (for example B-Frames), for formats that have keyframes and forward predicted frames. (Since: 1.18) */
		TRICKMODE_FORWARD_PREDICTED = 1 << 9,
		/** Signals that a rate change should be applied immediately. Only valid if start/stop position are GST_CLOCK_TIME_NONE, the playback direction does not change and the seek is not flushing. (Since: 1.18) */
		INSTANT_RATE_CHANGE = 1 << 10
	}

	type GstMessageGeneric = {
		type: GstMessageType
		/**
		 * The element name originating the message
		 */
		_src_element_name: string
		[key: string]: any
	}

	type GstMessageStateChanged = {
		type: GstMessageType.STATE_CHANGED
		/**
		 * the previous state
		 */
		'old-state': GstState
		/**
		 * the new (current) state
		 */
		'new-state': GstState
		/**
		 * the pending (target) state
		 */
		'pending-state': GstState
	} & GstMessageGeneric

	enum GstState {
		/**
		 * no pending state.
		 */
		VOID_PENDING = 'GST_STATE_VOID_PENDING',
		/**
		 * the NULL state or initial state of an element.
		 */
		NULL = 'GST_STATE_NULL',
		/**
		 * the element is ready to go to PAUSED.
		 */
		READY = 'GST_STATE_READY',
		/**
		 * the element is PAUSED, it is ready to accept and process data. Sink elements however only accept one buffer and then block.
		 */
		PAUSED = 'GST_STATE_PAUSED',
		/**
		 * the element is PLAYING, the Gst.Clock is running and the data is flowing.
		 */
		PLAYING = 'GST_STATE_PLAYING',
	}

	enum GstMessageType {
		/**
		 * An undefined message
		 */
		UNKNOWN = 'unknown',
		/**
		 * End-of-stream reached in a pipeline
		 * The application will only receive this message in the PLAYING state and every time it sets a pipeline to PLAYING that is in the EOS state. The application can perform a flushing seek in the pipeline, which will undo the EOS state again.
		 */
		EOS = 'eos',
		/**
		 * An error occurred
		 * When the application receives an error message it should stop playback of the pipeline and not assume that more data will be played. It is possible to specify a redirection url to the error messages by setting a redirect-location field into the error message, application or high level bins might use the information as required.
		 */
		ERROR = 'error',
		/**
		 * A warning occurred
		 */
		WARNING = 'warning',
		/**
		 * An info message occurred
		 */
		INFO = 'info',
		/**
		 * A tag was found.
		 */
		TAG = 'tag',
		/**
		 * The pipeline is buffering
		 * When the application receives a buffering message in the PLAYING state for a non-live pipeline it must PAUSE the pipeline until the buffering completes, when the percentage field in the message is 100%. For live pipelines, no action must be performed and the buffering percentage can be used to inform the user about the progress.
		 */
		BUFFERING = 'buffering',
		/**
		 * A state change happened
		 */
		STATE_CHANGED = 'state-changed',
		/**
		 * An element changed state in a streaming thread.
		 * @deprecated
		 */
		STATE_DIRTY = 'state-dirty',
		/**
		 * A stepping operation finished
		 */
		STEP_DONE = 'step-done',
		/**
		 * An element notifies its capability of providing a clock.
		 * This message is used internally and never forwarded to the application.
		 */
		CLOCK_PROVIDE = 'clock-provide',
		/**
		 * The current clock as selected by the pipeline became unusable.
		 * The pipeline will select a new clock on the next PLAYING state change. The application should set the pipeline to PAUSED and back to PLAYING when this message is received.
		 */
		CLOCK_LOST = 'clock-lost',
		/**
		 * A new clock was selected in the pipeline.
		 */
		NEW_CLOCK = 'new-clock',
		/**
		 * The structure of the pipeline changed.
		 * This message is used internally and never forwarded to the application.
		 */
		STRUCTURE_CHANGE = 'structure-change',
		/**
		 * Status about a stream, emitted when it starts, stops, errors, etc.
		 */
		STREAM_STATUS = 'stream-status',
		/**
		 * Message posted by the application, possibly via an application-specific element.
		 */
		APPLICATION = 'application',
		/**
		 * Element-specific message, see the specific element's documentation
		 */
		ELEMENT = 'element',
		/**
		 * Pipeline started playback of a segment.
		 * This message is used internally and never forwarded to the application.
		 */
		SEGMENT_START = 'segment-start',
		/**
		 * Pipeline completed playback of a segment.
		 * This message is forwarded to the application after all elements that posted GST_MESSAGE_SEGMENT_START posted a GST_MESSAGE_SEGMENT_DONE message.
		 */
		SEGMENT_DONE = 'segment-done',
		/**
		 * The duration of a pipeline changed.
		 * The application can get the new duration with a duration query.
		 */
		DURATION_CHANGED = 'duration-changed',
		/**
		 * Posted by elements when their latency changes.
		 * The application should recalculate and distribute a new latency.
		 */
		LATENCY = 'latency',
		/**
		 * Posted by elements when they start an ASYNC Gst.StateChange.
		 * This message is not forwarded to the application but is used internally.
		 */
		ASYNC_START = 'async-start',
		/**
		 * Posted by elements when they complete an ASYNC Gst.StateChange.
		 * The application will only receive this message from the toplevel pipeline.
		 */
		ASYNC_DONE = 'async-done',
		/**
		 * Posted by elements when they want the pipeline to change state.
		 * This message is a suggestion to the application which can decide to perform the state change on (part of) the pipeline.
		 */
		REQUEST_STATE = 'request-state',
		/**
		 * A stepping operation was started.
		 */
		STEP_START = 'step-start',
		/**
		 * A buffer was dropped or an element changed its processing strategy for Quality of Service reasons.
		 */
		QOS = 'qos',
		/**
		 * A progress message.
		 */
		PROGRESS = 'progress',
		/**
		 * A new table of contents (TOC) was found or previously found TOC was updated.
		 */
		TOC = 'toc',
		/**
		 * Message to request resetting the pipeline's running time from the pipeline.
		 * This is an internal message which applications will likely never receive.
		 */
		RESET_TIME = 'reset-time',
		/**
		 * Message indicating start of a new stream.
		 * Useful e.g. when using playbin in gapless playback mode, to get notified when the next title actually starts playing (which will be some time after the URI for the next title has been set).
		 */
		STREAM_START = 'stream-start',
		/**
		 * Message indicating that an element wants a specific context
		 * @since 1.2
		 */
		NEED_CONTEXT = 'need-context',
		/**
		 * Message indicating that an element created a context
		 * @since 1.2
		 */
		HAVE_CONTEXT = 'have-context',
		/**
		 * Message is an extended message type (see below). These extended message IDs can't be used directly with mask-based API like Gst.Bus.prototype.poll or Gst.Bus.prototype.timed_pop_filtered, but you can still filter for GST_MESSAGE_EXTENDED and then check the result for the specific type. (Since: 1.4)
		 */
		EXTENDED = 'extended',
		/**
		 * Message indicating a Gst.Device was added to a Gst.DeviceProvider
		 * @since 1.4
		 */
		DEVICE_ADDED = 'device-added',
		/**
		 * Message indicating a Gst.Device was removed from a Gst.DeviceProvider
		 * @since 1.4
		 */
		DEVICE_REMOVED = 'device-removed',
		/**
		 * Message indicating a GObject.Object property has changed
		 * @since 1.10
		 */
		PROPERTY_NOTIFY = 'property-notify',
		/**
		 * Message indicating a new Gst.StreamCollection is available
		 * @since 1.10
		 */
		STREAM_COLLECTION = 'stream-collection',
		/**
		 * Message indicating the active selection of Gst.Stream has changed
		 * @since 1.10
		 */
		STREAMS_SELECTED = 'streams-selected',
		/**
		 * Message indicating to request the application to try to play the given URL(s). Useful if for example a HTTP 302/303 response is received with a non-HTTP URL inside.
		 * @since 1.10
		 */
		REDIRECT = 'redirect',
		/**
		 * Message indicating a Gst.Device was changed a Gst.DeviceProvider
		 * @since 1.16
		 */
		DEVICE_CHANGED = 'device-changed',
		/**
		 * Message sent by elements to request the running time from the pipeline when an instant rate change should be applied (which may be in the past when the answer arrives).
		 * @since 1.18
		 */
		INSTANT_RATE_REQUEST = 'instant-rate-request',
	}
}
