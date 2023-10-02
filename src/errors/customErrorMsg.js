export default class CstmErrMsg {
  genProdErrInfo = (product) => {
    return `One or more product properties are not being received correctly:
    * title: must be string. Received       : ${product.title}
    * description: must be string. Received  : ${product.description}
    * price: must be number. Received       : ${product.price}
    * stock: must be number. Received       : ${product.stock}
    * thumbnails: must be string. Received  : ${product.thumbnails}
    * code: must be string. Received        : ${product.code};
    * category: must be string. Received    : ${product.category}`;
  };

  genProdErrExists = (product) => {
    return ` The product already exists.`;
  };
}
