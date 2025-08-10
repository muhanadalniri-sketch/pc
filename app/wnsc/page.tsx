import RecordForm from '../../components/RecordForm';
import RecordList from '../../components/RecordList';
export default function WNSCPage(){
  return (
    <div className="container">
      <h1 className="title" style={{color:'#fff'}}>NAMA (WNSC)</h1>
      <RecordForm type="WNSC"/>
      <RecordList/>
    </div>
  );
}
