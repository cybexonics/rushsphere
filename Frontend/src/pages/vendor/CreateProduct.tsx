import { useState, useEffect } from 'react'
import axios from 'axios'
import { getData } from '@/lib/getData'
import { useAuth } from '@/context/AuthProvider'

export default function ProductCreate() {

  const { vendor } = useAuth()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    old_price: 0,
    description: '',
    isNew: false,
    category: '',
    subcategory: '',
    other: {},
  });

  const [saving, setSaving] = useState(false);
  const [vendorsList, setVendorsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [colorList, setColorList] = useState<string[]>([]);
  const [sizeList, setSizeList] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [featuresList, setFeaturesList] = useState<{ key: string, value: string }[]>([]);
  const [newFeatureKey, setNewFeatureKey] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [refund,setRefund] = useState('');

  // Fetch categories/subcategories/vendors once on mount
  useEffect(() => {
    const fetchLists = async () => {
      const vendors = await getData('vendors');
      const categories = await getData('categories');
      const subcategories = await getData('subcategories?populate=*');
      setVendorsList(vendors.data || []);
      setCategoriesList(categories.data || []);
      setSubcategoriesList(subcategories.data || []);
    };
    fetchLists();
  }, []);

  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/&/g, '-and-')      // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
      .replace(/\-\-+/g, '-');     // Replace multiple - with single -

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && { slug: slugify(value) }), // Auto-generate slug when name changes
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !colorList.includes(newColor.trim())) {
      setColorList([...colorList, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (color) => setColorList(colorList.filter(c => c !== color));

  const addSize = () => {
    if (newSize.trim() && !sizeList.includes(newSize.trim())) {
      setSizeList([...sizeList, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (size) => setSizeList(sizeList.filter(s => s !== size));

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

  // Handle image selection + auto-upload
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setUploading(true);

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "website"); // your Cloudinary preset

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/djztk7ohs/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.secure_url) {
          setImageUrls((prev) => [...prev, data.secure_url]);
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('❌ Image upload failed');
      }
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const selectedCategory = categoriesList.find(c => c.documentId === form.category);
    const selectedSubcategory = subcategoriesList.find(s => s.documentId === form.subcategory);

    const categoryId = selectedCategory?.documentId;
    const subcategoryId = selectedSubcategory?.documentId;

    try {
      const featuresObj = {};
      featuresList.forEach(({ key, value }) => {
        featuresObj[key] = value;
      });

      const data = {
        ...form,
        slug: slugify(form.name),
        images: imageUrls,
        description: [form.description],
        features: [featuresObj],
        other: {
          color: colorList,
          size: sizeList,
          refund:refund,
        },
        vendor: vendor?.documentId,
        category: categoryId,
        subcategory: subcategoryId,
        availability: true,
      };

      await axios.post('https://rushsphere.onrender.com/api/products', { data });

      alert('✅ Product created successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create product');
    }

    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow space-y-6">
      <h1 className="text-2xl font-bold">➕ Create New Product</h1>

      {/* Basic Info */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
          placeholder="Auto-generated slug"
          readOnly
        />
      </div>

      {/* Auto-upload Images on Selection */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Product Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
        {uploading && <p className="text-sm text-purple-600 mt-2">Uploading images...</p>}

        {imageUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded ${index}`}
                className="w-full rounded-md object-cover h-32"
              />
            ))}
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
            placeholder="Enter price"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Old Price</label>
          <input
            type="number"
            name="old_price"
            value={form.old_price}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
            placeholder="Enter old price"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
          placeholder="Enter description"
          rows={5}
          required
        />
      </div>

      {/* Colors */}
      <div>
        <label className="block font-medium mb-1">Colors</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Add color"
            className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
          <button type="button" onClick={addColor} className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {colorList.map(c => (
            <div key={c} className="flex items-center gap-1 bg-purple-100 text-purple-800 rounded px-3 py-1 text-sm">
              <span>{c}</span>
              <button type="button" onClick={() => removeColor(c)} className="font-bold">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="block font-medium mb-1">Sizes</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Add size"
            className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
          <button type="button" onClick={addSize} className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizeList.map(s => (
            <div key={s} className="flex items-center gap-1 bg-purple-100 text-purple-800 rounded px-3 py-1 text-sm">
              <span>{s}</span>
              <button type="button" onClick={() => removeSize(s)} className="font-bold">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block font-medium mb-2">Features</label>
        <div className="space-y-2 mb-4">
          {featuresList.map(({ key, value }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="font-semibold">{key}:</span>
              <span>{value}</span>
              <button type="button" onClick={() => removeFeature(key)} className="ml-auto text-red-500 font-bold">×</button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Feature key"
            value={newFeatureKey}
            onChange={e => setNewFeatureKey(e.target.value)}
            className="w-full sm:flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Feature value"
            value={newFeatureValue}
            onChange={e => setNewFeatureValue(e.target.value)}
            className="w-full sm:flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addFeature}
            className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add Feature
          </button>
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block font-medium">Category</label>

        <select
          name="category"
          value={form.category}
          onChange={e => {
            setForm(prev => ({
              ...prev,
              category: e.target.value,
              subcategory: '' // reset subcategory
            }));
          }}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
          required
        >
          <option value="">-- Select Category --</option>
          {categoriesList.map(c => (
            <option key={c.id} value={c.documentId}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      <div>
        <label className="block font-medium">Subcategory</label>
        <select
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
          disabled={!form.category}
        >
          <option value="">-- Select Subcategory --</option>
          {subcategoriesList
            .filter(sub => sub.category?.documentId === form.category)
            .map(sub => (
              <option key={sub.id} value={sub.documentId}>{sub.name}</option>
            ))}
        </select>
      </div>

      {/* New Product Checkbox */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          name="isNew"
          checked={form.isNew}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="font-medium">Mark as New</label>
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

      <button
        type="submit"
        disabled={saving}
        className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : '💾 Create Product'}
      </button>
    </form>
  );
}

