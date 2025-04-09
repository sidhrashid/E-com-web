/* eslint-disable react/prop-types */

const DeleteModal = ({ isOpen, onClose, onConfirm, fieldName }) => {
  if (!isOpen) return null;

  return (
    <div className="z-[9999] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm sm:p-4 pl-10">
      <div className="bg-white sm:p-6 py-3 ml-4 rounded-lg shadow-lg w-full max-w-[250px] sm:max-w-sm text-center">
        <h3 className="text-lg font-semibold">
          Are you sure you want to delete this {fieldName}?
        </h3>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
