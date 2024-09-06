import { GstSeekFlags, GstMessageType, GstState, } from './index'
export { GstSeekFlags, GstMessageType, GstState, }

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
}

export type GstMessageGeneric = {
	type: GstMessageType
	/**
	 * The element name originating the message
	 */
	_src_element_name: string
	[key: string]: any
}

export type GstMessageStateChanged = {
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
