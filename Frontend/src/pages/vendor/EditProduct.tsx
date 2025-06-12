import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '@/lib/getData';
import { transformProductData } from '@/lib/transformProductData';
import axios from 'axios';
import { useAuth } from "@/context/AuthProvider";

export default function ProductAdminEdit() {
  const { slug } = useParams();
  const [form, setForm] = useState({});
  const [initialForm, setInitialForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { vendor } = useAuth();

  const [vendorsList, setVendorsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [featuresList, setFeaturesList] = useState([]);
  const [newFeatureKey, setNewFeatureKey] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  const [refund,setRefund] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, vendorsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          getData(`products?filters[slug][$eq]=${slug}&populate=*`),
          getData('vendors'),
          getData('categories'),
          getData('subcategories?populate=*'),
        ]);

        const fetchedProduct = productRes?.data;
        const [transformed] = transformProductData(fetchedProduct);

        const formData = {
          id: transformed?.sku || '',
          name: transformed?.name || '',
          slug: transformed?.slug || '',
          price: transformed?.price || '',
          old_price: transformed?.old_price || 0,
          description: transformed?.description,
          isNew: transformed?.isNew,
          category: transformed?.category?.documentId || '',
          subcategory: transformed?.subcategory?.documentId || '',
          other: transformed?.other || {},
          features: transformed?.features,
        };

        setForm(formData);
        setInitialForm(formData);
        setCategoriesList(categoriesRes.data || []);
        setSubcategoriesList(subcategoriesRes.data || []);
        setColorList(transformed?.other?.color || []);
        setSizeList(transformed?.other?.size || []);
        setImageUrls(transformed?.images || []);
        setRefund(transformed?.other?.refund || 0);

        const feats = transformed?.features;
        if (feats && typeof feats === 'object' && !Array.isArray(feats)) {
          setFeaturesList(Object.entries(feats).map(([key, value]) => ({ key, value })));
        } else if (Array.isArray(feats)) {
          setFeaturesList(feats);
        } else {
          setFeaturesList([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [slug]);

  // Additional states
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState({});

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  setImageFiles(files);
};

useEffect(() => {
  if (imageFiles.length === 0) return;

  const uploadImages = async () => {
    setUploading(true);
    const newUrls = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "website");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/djztk7ohs/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          newUrls.push(data.secure_url);
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}`, err);
      }
    }

    if (newUrls.length) {
      setImageUrls((prev) => [...prev, ...newUrls]);
    }

    setUploading(false);
    setImageFiles([]);
  };

  uploadImages();
}, [imageFiles]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !colorList.includes(newColor.trim())) {
      setColorList([...colorList, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (color) => {
    setColorList(colorList.filter(c => c !== color));
  };

  const addSize = () => {
    if (newSize.trim() && !sizeList.includes(newSize.trim())) {
      setSizeList([...sizeList, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (size) => {
    setSizeList(sizeList.filter(s => s !== size));
  };

  const addFeature = () => {
    if (newFeatureKey.trim() && newFeatureValue.trim()) {
      setFeaturesList([...featuresList, { key: newFeatureKey.trim(), value: newFeatureValue.trim() }]);
      setNewFeatureKey('');
      setNewFeatureValue('');
    }
  };

  const removeFeature = (key) => {
    setFeaturesList(featuresList.filter(f => f.key !== key));
  };

  const getChangedFields = () => {
    const updatedOther = {
      ...form.other,
      color: colorList,
      size: sizeList,
      refund:refund,
    };

    const featuresObj = {};
    featuresList.forEach(({ key, value }) => {
      featuresObj[key] = value;
    });

    const newPayload = {
      ...form,
  category: {
    connect: [{ documentId: form.category }]
  },
  ...(form.subcategory ? {
    subcategory: {
      connect: [{ documentId: form.subcategory }]
    }
  } : {}),
      images: imageUrls,
      description: [form.description],
      features: [featuresObj],
      other: updatedOther,
      availability: true,
    };

    const payload = {};
    for (let key in newPayload) {
      if (JSON.stringify(newPayload[key]) !== JSON.stringify(initialForm[key])) {
        payload[key] = newPayload[key];
      }
    }
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = getChangedFields();
      if (Object.keys(payload).length === 0) {
        alert('⚠️ No changes to update.');
        setSaving(false);
        return;
      }

      console.log(payload)

      await axios.put(`https://rushsphere.onrender.com/api/products/${form.id}`, {
        data: payload
      });

      alert('✅ Product updated successfully!');
    } catch (err) {
      alert('❌ Failed to save changes');
      console.error(err);
    }
    setSaving(false);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading product...</p>;

  return (
   <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow space-y-6">
  <h1 className="text-2xl font-bold">🛠 Edit Product</h1>

  {/* Name */}
  <div>
    <label className="block font-semibold mb-1" htmlFor="name">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      value={form.name || ''}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      required
    />
  </div>

  {/* Slug */}
  <div>
    <label className="block font-semibold mb-1" htmlFor="slug">Slug</label>
    <input
      type="text"
      id="slug"
      name="slug"
      value={form.slug || ''}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      required
    />
  </div>

  {/* Price */}
  <div>
    <label className="block font-semibold mb-1" htmlFor="price">Price</label>
    <input
      type="number"
      id="price"
      name="price"
      value={form.price || ''}
      onChange={handleChange}
      min="0"
      step="0.01"
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      required
    />
  </div>

  {/* Old Price */}
  <div>
    <label className="block font-semibold mb-1" htmlFor="old_price">Old Price</label>
    <input
      type="number"
      id="old_price"
      name="old_price"
      value={form.old_price || ''}
      onChange={handleChange}
      min="0"
      step="0.01"
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
    />
  </div>

  {/* Description */}
  <div>
    <label className="block font-semibold mb-1" htmlFor="description">Description</label>
    <textarea
      id="description"
      name="description"
      value={form.description || ''}
      onChange={handleChange}
      rows={5}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
    />
  </div>

  {/* Is New */}
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id="isNew"
      name="isNew"
      checked={!!form.isNew}
      onChange={handleChange}
      className="w-4 h-4"
    />
    <label htmlFor="isNew" className="font-semibold">New Product</label>
  </div>

  {/* Category */}
  <div>
    <label className="block font-semibold mb-1" htmlFor="category">Category</label>
    <select
      id="category"
      name="category"
      value={form.category || ''}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      required
    >
      <option value="">-- Select Category --</option>
      {categoriesList.map(cat => (
        <option key={cat.id} value={cat.documentId}>{cat.name}</option>
      ))}
    </select>
  </div>

  {/* Subcategory */}
  <div>
    <label className="block font-semibold mb-1" htmlFor="subcategory">Subcategory</label>
    <select
      id="subcategory"
      name="subcategory"
      value={form.subcategory || ''}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
    >
      <option value="">-- Select Subcategory --</option>
      {subcategoriesList.map(subcat => (
        <option key={subcat.id} value={subcat.documentId}>{subcat.name}</option>
      ))}
    </select>
  </div>

  {/* Colors */}
  <div>
    <label className="block font-semibold mb-1">Colors</label>
    <div className="flex space-x-2 mb-2 flex-wrap">
      {colorList.map(color => (
        <div
          key={color}
          className="flex items-center space-x-1 bg-purple-100 text-purple-800 rounded px-2 py-1 cursor-pointer"
          onClick={() => removeColor(color)}
          title="Click to remove"
        >
          <span>{color}</span>
          <span className="font-bold">&times;</span>
        </div>
      ))}
    </div>
    <div className="flex space-x-2">
      <input
        type="text"
        value={newColor}
        onChange={e => setNewColor(e.target.value)}
        placeholder="Add color"
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <button
        type="button"
        onClick={addColor}
        className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700"
      >
        Add
      </button>
    </div>
  </div>

  {/* Sizes */}
  <div>
    <label className="block font-semibold mb-1">Sizes</label>
    <div className="flex space-x-2 mb-2 flex-wrap">
      {sizeList.map(size => (
        <div
          key={size}
          className="flex items-center space-x-1 bg-purple-100 text-purple-800 rounded px-2 py-1 cursor-pointer"
          onClick={() => removeSize(size)}
          title="Click to remove"
        >
          <span>{size}</span>
          <span className="font-bold">&times;</span>
        </div>
      ))}
    </div>
    <div className="flex space-x-2">
      <input
        type="text"
        value={newSize}
        onChange={e => setNewSize(e.target.value)}
        placeholder="Add size"
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <button
        type="button"
        onClick={addSize}
        className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700"
      >
        Add
      </button>
    </div>
  </div>

  {/* Features */}
  <div>
    <label className="block font-semibold mb-1">Features</label>
    {featuresList.length === 0 && (
      <p className="text-gray-500 italic">No features added yet.</p>
    )}
    <div className="space-y-2 mb-4">
      {featuresList.map(({ key, value }) => (
        <div
          key={key}
          className="flex items-center space-x-2 bg-purple-50 rounded px-3 py-2"
        >
          <div className="flex-grow">
            <strong>{key}:</strong> {value}
          </div>
          <button
            type="button"
            onClick={() => removeFeature(key)}
            className="text-red-600 hover:underline"
            title="Remove feature"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
    <div className="flex space-x-2">
      <input
        type="text"
        placeholder="Feature key"
        value={newFeatureKey}
        onChange={e => setNewFeatureKey(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <input
        type="text"
        placeholder="Feature value"
        value={newFeatureValue}
        onChange={e => setNewFeatureValue(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <button
        type="button"
        onClick={addFeature}
        className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700"
      >
        Add
      </button>
    </div>
  </div>
   <div>
          <label className="block font-medium">How Many Days to refund? (Non Editable)</label>
          <input
            type="number"
            name="refund"
            value={refund}
            onChange={(e)=>setRefund(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
            placeholder="How Many Days to refund?"
          />
        </div>

  {/* Images URLs (readonly display only) */}
  <div>
  <label className="block font-semibold mb-1">Upload Images</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleFileChange}
    className="mb-2"
  />

  {uploading && (
    <p className="text-sm text-purple-600 font-medium">Uploading images...</p>
  )}

  {imageUrls.length > 0 && (
  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
    {imageUrls.map((url, i) => (
      <div key={i} className="relative">
        <img
          src={url}
          alt={`Uploaded ${i}`}
          className="w-full h-32 object-cover rounded border"
        />
        <button
          type="button"
          onClick={() => {
            setImageUrls(prev => prev.filter(u => u !== url));
          }}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 shadow"
          title="Remove image"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

</div>

  {/* Save Button */}
  <button
    type="submit"
    disabled={saving}
    className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700 disabled:opacity-50"
  >
    {saving ? 'Saving...' : '💾 Save Changes'}
  </button>
</form>

  );
}

