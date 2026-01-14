


export default function Contact() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20 space-y-16">
      {/* Info blocks */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-50 p-8 text-center rounded">
          <div className="text-3xl mb-3">📍</div>
          <h4 className="font-semibold tracking-wide text-sm">OUR ADDRESS</h4>
          <p className="text-sm mt-1">3517 W, Gray St. Utica 57867</p>
        </div>

        <div className="bg-gray-50 p-8 text-center rounded space-y-4">
          <div>
            <div className="text-3xl mb-3">📞</div>
            <p className="text-sm font-semibold">(406) 555 0120</p>
          </div>
          <div>
            <div className="text-3xl mb-3">✉️</div>
            <p className="text-sm font-semibold">elzacoffe.co.ke</p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 text-center rounded">
          <div className="text-3xl mb-3">⏰</div>
          <h4 className="font-semibold tracking-wide text-sm">OPENING HOUR</h4>
          <p className="text-sm mt-1">Monday-Friday. 9.00AM-12.00PM</p>
        </div>
      </div>

      {/* Form */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-wide">GET IN TOUCH</h2>
      </div>

      <form className="max-w-3xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Name"
            className="border-b focus:outline-none py-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="border-b focus:outline-none py-2"
          />
        </div>

        <input
          type="text"
          placeholder="Subject"
          className="w-full border-b focus:outline-none py-2"
        />

        <textarea
          placeholder="Message"
          rows="3"
          className="w-full border-b focus:outline-none py-2 resize-none"
        />

        <div className="text-center">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-8 rounded"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </section>
  );
}
