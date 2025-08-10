import RecordForm from '../../components/RecordForm';
import RecordList from '../../components/RecordList';
export default function WOPage(){
  return (
    <div className="container">
      <h1 className="title" style={{color:'#fff'}}>Oman Oil (WO)</h1>
      <RecordForm type="WO"/>
      <RecordList/>
    </div>
  );
}
