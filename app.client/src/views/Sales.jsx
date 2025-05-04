import './Sales.css';
import GenericCrudPage from '../components/common/GenericCrudPage';
import salesConfig from './salesConfig';

function Sales() {
  return (
    <div className="sales-container">
      <GenericCrudPage {...salesConfig} />
    </div>
  );
}

export default Sales;
