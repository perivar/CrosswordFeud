
export const classNames = (props: any) => Object.keys(props)
  .filter(f => props[f] === true)
  .join(' ');
