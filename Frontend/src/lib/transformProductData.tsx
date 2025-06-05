// src/utils/transformProductData.js

export function transformProductData(rawData) {
  return rawData.map((item) => {
    return {
      product_id: String(item.id),
      isApproved:item.isApproved,
      name: item.name || '',
      slug:item.slug,
      description: item.description[0].trim(),
      category: item.category,
      sub_categaory:item.subcategory,
      brand: 'Generic Brand',
      price: item.price || 0,
      old_price: item.old_price || 0,
      availability: item.availability,
      rating: 4.0,
      reviews_count: 0,
      features:item.features[0],
      images: item.images,
      isNew:item.isNew,
      vendor: {
        vendor_id: item?.vendor?.documentId,
        name: item?.vendor?.businessName,
        contact_email: item?.vendor?.email,
        location: item?.vendor?.zipCode,
        rating: item?.vendor?.[0]?.reating || 4.5
      },
      warranty: 'No warranty info',
      other: item.other,
      sku: item.documentId || '',
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
  });
}

