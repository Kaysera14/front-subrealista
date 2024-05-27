export function CostsPc({ post, daysDiff }) {
  const rentPrice = post.rent_price.toFixed(2);
  const totalCost = (
    post.rent_price * daysDiff +
    (post.rent_price * 24) / 100 +
    (post.rent_price * 21) / 100
  ).toFixed(2);
  const cleaningCost = ((post.rent_price * 24) / 100).toFixed(2);
  const taxCost = ((post.rent_price * 21) / 100).toFixed(2);

  return (
    <ul className="w-full p-6">
      <li className="flex flex-row w-full justify-between py-1">
        <p>{`${rentPrice} x ${daysDiff} noches`}</p>
        <p>{`${(post.rent_price * daysDiff).toFixed(2)}€`}</p>
      </li>
      <li className="flex flex-row w-full justify-between py-1">
        <p>Gastos de limpieza</p>
        <p>{`${cleaningCost}€`}</p>
      </li>
      <li className="flex flex-row w-full justify-between py-1">
        <p>Impuestos</p>
        <p>{`${taxCost}€`}</p>
      </li>
      <li className="flex flex-row w-full justify-between border-t pt-6 mt-5">
        <p className="font-semibold">Total</p>
        <p className="font-semibold">{`${totalCost}€`}</p>
      </li>
    </ul>
  );
}
