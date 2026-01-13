export default function ProductDetails() {

  return (
    <div className="mt-8 space-y-6">
      {/* Care Instructions */}
      <div>
        <h2 className="text-2xl font-serif text-gray-900 mb-4 border-b pb-2">
          CARE INSTRUCTIONS:
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Wipe with a soft, dry cloth to maintain shine</li>
          <li>Keep away from moisture and direct sunlight</li>
          <li>Store in a cool, dry place when not in use</li>
          <li>Handle with care to preserve the delicate structure</li>
        </ul>
      </div>
    </div>
  )
}
