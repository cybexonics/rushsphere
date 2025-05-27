// src/utils/transformProductData.js

export function transformProductData(rawData) {
  return rawData.map((item) => {
    // Extract plain text from description blocks
    let description = '';
    if (Array.isArray(item.description)) {
      item.description.forEach(block => {
        if (block.type === 'paragraph') {
          block.children?.forEach(child => {
            if (child.type === 'text') {
              description += child.text + ' ';
            }
          });
        }
      });
    }

    // Extract features as array of strings
    const features = [];
    item.features?.forEach(block => {
      if (block.type === 'list') {
        block.children?.forEach(listItem => {
          listItem.children?.forEach(child => {
            if (child.type === 'text') {
              features.push(child.text);
            }
          });
        });
      }
    });

    return {
      product_id: String(item.id),
      name: item.name || '',
      description: description.trim(),
      category: 'General',
      sub_categaory:'T-Shirt',
      brand: 'Generic Brand',
      price: item.price || 0,
      old_price: item.old_price || 0,
      availability: 'In Stock',
      rating: 4.0,
      reviews_count: 0,
      features,
      images: [],
      vendor: {
        vendor_id: 'default-v001',
        name: 'Default Vendor',
        contact_email: 'info@vendor.com',
        location: 'Unknown',
        rating: 4.5
      },
      warranty: 'No warranty info',
      tags: item.other?.color || [],
      sku: item.documentId || '',
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
  });
}

