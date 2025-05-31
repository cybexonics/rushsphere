import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getData } from '@/lib/getData'
import { transformProductData } from '@/lib/transformProductData'
import axios from 'axios';

export default function ProductAdminEdit() {
  const { slug } = useParams();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dropdown options
  const [vendorsList, setVendorsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
const [imageUrls, setImageUrls] = useState([]);


  // Color & size arrays (for inputs)
  const [colorList, setColorList] = useState([]);
  const [sizeList, setSizeList] = useState([]);

  // Inputs for new color/size
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');

  // Features as array of { key, value }
  const [featuresList, setFeaturesList] = useState([]);
  const [newFeatureKey, setNewFeatureKey] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');

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
        console.log(fetchedProduct)

        setForm({
          id: transformed?.sku || '',
          name: transformed?.name || '',
          slug: transformed?.slug || '',
          price: transformed?.price || '',
          old_price: transformed?.old_price || 0,
          description: transformed?.description,
          isNew: transformed?.isNew,
          categories: transformed?.categories?.id || '',
          subcategory: transformed?.subcategory?.id || '',
          other: transformed?.other || {},
          features: transformed?.features,
        });
        setVendorsList(vendorsRes.data || []);
        setCategoriesList(categoriesRes.data || []);
        setSubcategoriesList(subcategoriesRes.data || []);

        // Initialize color and size arrays
        setColorList(transformed?.other?.color || []);
        setSizeList(transformed?.other?.size || []);
        setImageUrls(transformed?.images || [])

        // Features might come as object or array — convert to array of key-value pairs
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Color handlers
  const addColor = () => {
    if (newColor.trim() && !colorList.includes(newColor.trim())) {
      setColorList([...colorList, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (color) => {
    setColorList(colorList.filter(c => c !== color));
  };

  // Size handlers
  const addSize = () => {
    if (newSize.trim() && !sizeList.includes(newSize.trim())) {
      setSizeList([...sizeList, newSize.trim()]);
      setNewSize('');
    }
  };

  const removeSize = (size) => {
    setSizeList(sizeList.filter(s => s !== size));
  };

  // Features handlers
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
try {
    // Prepare features object
    const featuresObj = {};
    featuresList.forEach(({ key, value }) => {
      featuresObj[key] = value;
    });

    const updatedOther = {
      ...form.other,
      color: colorList,
      size: sizeList,
    };

    // Remove id from the body
    const { id, ...rest } = form;

    const data = {
      ...rest,
      images:imageUrls,
      description: [form.description],
      features: [featuresObj],
      other: updatedOther,
    };


      const productId = form?.id;
      console.log(data) 

      await axios.put(`http://localhost:1337/api/products/${productId}`, { data });

      alert('✅ Product updated successfully!');
    } catch (err) {
      alert('❌ Failed to save changes');
      console.error(err);
    }

    setSaving(false);
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading product...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow space-y-6">
      <h1 className="text-2xl font-bold">🛠 Edit Product</h1>

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
        />
      </div>

      <div className="mb-4">
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
          placeholder="Enter product slug"
        />
      </div>



      {/* Upload Multiple Images */}
<div className="mb-4">
  <label className="block font-medium mb-1">Product Images</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      setImageFiles(files);
    }}
    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
  />
  <button
    type="button"
    onClick={async () => {
      for (let file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "company-test"); // <-- replace with yours

        const res = await fetch("https://api.cloudinary.com/v1_1/dd5rsnbgi/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          setImageUrls((prev) => [...prev, data.secure_url]); // ✅ Correct
        }
      }
    }}
    className="mt-2 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
  >
    Upload Images
  </button>

  {imageUrls?.length > 0 && (
    <div className="mt-4 grid grid-cols-3 gap-4">
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Uploaded ${index}`} className="w-full rounded-md" />
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
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
            placeholder="Enter price"
          />
        </div>
        <div>
          <label className="block font-medium">Old Price</label>
          <input
            type="number"
            name="old_price"
            value={form.old_price}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
            placeholder="Enter old price"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
          placeholder="Enter description"
          rows="5"
        />
      </div>

      {/* Color inputs with Add button */}
      <div>
        <label className="block font-medium mb-1">Colors</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Add color"
            className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
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

      {/* Size inputs with Add button */}
      <div>
        <label className="block font-medium mb-1">Sizes</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Add size"
            className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
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

      {/* Features dynamic key-value pairs */}
      <div>
        <label className="block font-medium mb-2">Features</label>
        <div className="space-y-2 mb-4">
          {featuresList.map(({ key, value }) => (
            <div key={key} className="flex items-center gap-2">
            
              <span className="font-semibold">{key}:</span>
              <span>{value}</span>
              <button
                type="button"
                onClick={() => removeFeature(key)}
                className="ml-auto text-red-500 hover:text-red-700 font-bold"
                aria-label={`Remove feature ${key}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
  <input
    type="text"
    placeholder="Feature key"
    value={newFeatureKey}
    onChange={e => setNewFeatureKey(e.target.value)}
    className="w-full sm:flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
  />
  <input
    type="text"
    placeholder="Feature value"
    value={newFeatureValue}
    onChange={e => setNewFeatureValue(e.target.value)}
    className="w-full sm:flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
  />
  <button
    type="button"
    onClick={addFeature}
    className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-all duration-200"
  >
    Add Feature
  </button>
</div>

      </div>

      {/* Dropdowns */}
     <div>
  <label className="block font-medium">Category</label>
  <select
    name="categories"
    value={form.categories}
    onChange={e => {
      setForm(prev => ({
        ...prev,
        categories: e.target.value,
        subcategory: '' // reset subcategory on category change
      }));
    }}
    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
  >
    <option value="">-- Select Category --</option>
    {categoriesList.map(c => (
      <option key={c.id} value={c.documentId}>
        {c.name}
      </option>
    ))}
  </select>
</div>

<div>
  <label className="block font-medium">Subcategory</label>
  <select
    name="subcategory"
    value={form.subcategory}
    onChange={handleChange}
    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
  >
    <option value="">-- Select Subcategory --</option>
    {subcategoriesList
      .filter(sub => sub.category?.documentId === form.categories)
      .map(sub => (
        <option key={sub.id} value={sub.documentId}>
          {sub.name}
        </option>
      ))}
  </select>
</div>


      {/* Boolean */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isNew"
          checked={form.isNew}
          onChange={handleChange}
        />
        <label className="font-medium">Mark as New</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700"
      >
        {saving ? 'Saving...' : '💾 Save Changes'}
      </button>
    </form>
  );
}

