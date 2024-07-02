import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateCaptions } from "../api/apiService";

interface VibeOption {
  value: string;
  emoji: string;
}

const vibe_list: VibeOption[] = [
  { value: "None", emoji: "🔄" },
  { value: "Fun", emoji: "😁" },
  { value: "Joke", emoji: "😂" },
  { value: "Cool", emoji: "😎" },
  { value: "Romantic", emoji: "❤️" },
  { value: "Inspirational", emoji: "✨" },
  { value: "Sarcastic", emoji: "🙃" },
  { value: "Mysterious", emoji: "🕵️" },
  { value: "Adventurous", emoji: "🏞️" },
  { value: "Nostalgic", emoji: "🕰️" },
  { value: "Futuristic", emoji: "🚀" },
  { value: "Artistic", emoji: "🎨" },
  { value: "Foodie", emoji: "🍽️" },
  { value: "Sporty", emoji: "🏅" },
  { value: "Nerdy", emoji: "🤓" },
  { value: "Professional", emoji: "💼" },
  { value: "Relaxed", emoji: "🏖️" },
  { value: "Excited", emoji: "🎉" },
  { value: "Philosophical", emoji: "🤔" },
  { value: "Nature-lover", emoji: "🌿" },
];

const HeroSection = () => {
  const [selectedVibe, setSelectedVibe] = useState(vibe_list[0]);
  const [selectFile, setSelectFile] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaptions] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      setSelectFile(file);
      if (file.size > 4194304) {
        toast.error("File is too big!");
        setSelectFile(null);
        setPreviewUrl(null);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const copyToClipboard = (caption: string): void => {
    navigator.clipboard.writeText(caption);
    toast.success("Caption copied to clipboard!");
  };

  const renderCaption = (caption: string, index: number): JSX.Element => {
    return (
      <div
        key={index}
        className="border border-gray-300 rounded-lg p-4 mb-4 flex items-center justify-between"
      >
        <p className="text-sm">{renderHashtagsInBlue(caption)}</p>
        <button
          className="ml-2 bg-gray-200 px-2 py-1 rounded-lg text-sm text-gray-700 hover:bg-gray-300 focus:outline-none"
          onClick={() => copyToClipboard(caption)}
        >
          Copy
        </button>
      </div>
    );
  };

  const renderHashtagsInBlue = (caption: string): JSX.Element => {
    const parts = caption.split(" ");
    return (
      <>
        {parts.map((part, index) => (
          <span
            key={index}
            className={part.startsWith("#") ? "text-blue-500" : ""}
          >
            {part}{" "}
          </span>
        ))}
      </>
    );
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectFile) {
      toast.error('Please upload an image.');
      return;
    }

    setLoading(true); 

    try {
      const captionsResponse = await generateCaptions(selectFile, selectedVibe.value);
      setCaptions(captionsResponse.enhancedCaption);
      toast.success('Captions generated successfully!');
    } catch (error) {
      toast.error('Error generating captions.');
      console.error('Error generating captions:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center">
      <div className="mb-8 text-center">
        <span className="text-5xl font-roboto font-black">
          Image Caption Generator
        </span>
        <p className="pt-2 font-semibold">
          Use AI to Create Caption for Any Image
        </p>
      </div>
      <div className="w-full max-w-[34rem]">
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">
            1. UPLOAD AN IMAGE OR PHOTO (MAX 4MB)
          </p>
          <div className="border-2 border-dashed hover:bg-[#f3f3f3] border-gray-300 rounded-lg p-8 text-center">
            <div
              onClick={() => handleUpload()}
              className="flex flex-col items-center cursor-pointer"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-40 mb-2 rounded"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}
              <span className="text-gray-500">
                {selectFile ? selectFile.name : "Click to Upload"}
              </span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">2. SELECT A VIBE</p>
          <div className="relative">
            <select
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none"
              value={selectedVibe.value}
              onChange={(e) =>
                setSelectedVibe(
                  vibe_list.find((vibe) => vibe.value === e.target.value) ||
                    vibe_list[0]
                )
              }
            >
              {vibe_list.map((vibe) => (
                <option key={vibe.value} value={vibe.value}>
                  {vibe.emoji} {vibe.value}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">
            3. ADDITIONAL PROMPT (OPTIONAL)
          </p>
          <input
            type="text"
            placeholder="eg. the photo is in Byron Bay"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <button
        onClick={() => handleSubmit()}
        type="submit"
        disabled={loading}
        className="mt-4 w-[39%] bg-[#407de7] text-white font-semibold p-[1rem] rounded-lg hover:bg-[#428bf9] transition duration-300"
      >
        {loading ? 'Generating...' : 'GENERATE CAPTIONS'}
      </button>

      <div className="caption-container mt-4">
        {caption.length > 0 ? (
          <div>
            <p className="text-lg font-semibold mb-2">Generated Captions:</p>
            {caption.map((caption, index) => renderCaption(caption, index))}
          </div>
        ) : (
          <p>No captions generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;