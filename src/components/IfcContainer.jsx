import { forwardRef } from 'react';

const IfcContainer = forwardRef((props, ref) => {
  const viewer = props.viewer;
  return (
    <div className='h-screen'>
      <div ref={ref} />
    </div>
  );
});

export { IfcContainer };
