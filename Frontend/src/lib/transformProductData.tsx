// src/utils/transformProductData.js

export function transformProductData(rawData) {
  return rawData.map((item) => {
    return {
      product_id: String(item.id),
      name: item.name || '',
      slug:item.slug,
      description: item.description[0].trim(),
      category: item.categories,
      sub_categaory:item.subcategory,
      brand: 'Generic Brand',
      price: item.price || 0,
      old_price: item.old_price || 0,
      availability: 'In Stock',
      rating: 4.0,
      reviews_count: 0,
      features:item.features[0],
      images: item.images,
      isNew:item.isNew,
      vendor: {
        vendor_id: item?.vendors?.[0]?.id,
        name: item?.vendors?.[0]?.first_name,
        contact_email: item?.vendors?.[0]?.email,
        location: item?.vendors?.[0]?.location || "India",
        rating: item?.vendors?.[0]?.reating || 4.5
      },
      warranty: 'No warranty info',
      other: item.other,
      sku: item.documentId || '',
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
  });
}

