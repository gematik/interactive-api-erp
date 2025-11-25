// Copyright 2024 gematik GmbH
//  
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//  
//     http://www.apache.org/licenses/LICENSE-2.0
//  
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Fragment, useState } from 'react';
import './App.css';
//import schema from './schema.json';
import communicationReplySchemaRaw from './CommunicationReplyPayload.json';
import communicationDispReqSchemaRaw from './CommunicationDispReqPayload.json';
import communicationRepresentativeSchemaRaw from './CommunicationRepresentativePayload.json';
import communicationReplyUISchemaRaw from './CommunicationReplyPayloadUISchema.json';
import communicationDispReqUISchemaRaw from './CommunicationDispReqPayloadUISchema.json';
import examples from './examples.json';
import Modal from '@mui/material/Modal';
import {
  materialRenderers,
} from '@jsonforms/material-renderers';
import { makeStyles } from '@mui/styles';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import SingleForm from './SingleForm';
import { Typography } from '@mui/material';

const communicationReplySchema: any = communicationReplySchemaRaw
const communicationReplyUISchema: any = communicationReplyUISchemaRaw
const communicationDispReqSchema: any = communicationDispReqSchemaRaw
const communicationDispReqUISchema: any = communicationDispReqUISchemaRaw
const communicationRepresentativeSchema: any = communicationRepresentativeSchemaRaw

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
];

interface TabMenuProps {
  setActiveTab: (tabId: string) => void;
  activeTab: string;
}

const TabMenu: React.FC<TabMenuProps> = (props) => {
  const handleTabChange = (tabId: string) => {
    props.setActiveTab(tabId);
  };

  return (
    <ul className="tab-menu">
    <li><button onClick={() => handleTabChange('dispReq')} className={props.activeTab === 'dispReq' ? 'active' : ''}>DispReq</button></li>
    <li><button onClick={() => handleTabChange('reply')} className={props.activeTab === 'reply' ? 'active' : ''}>Reply</button></li>
    <li><button onClick={() => handleTabChange('representative')} className={props.activeTab === 'representative' ? 'active' : ''}>Representative</button></li>
    <li><button className="legal" onClick={() => document.location.href='./sbom.spdx'}>SBOM</button></li>
  </ul>
  );
};

const useStyles = makeStyles({
  modal: {
    padding: '1em',
    width: '100%',
    background: 'white'
  },
  title: {
    textAlign: 'left',
    padding: '0.25em',
  }
});

const App = () => {
  const styles = useStyles();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState<string>('dispReq');
  const currentSchemaJson = () => {
    let schemaData = '{}';
    if (activeTab === 'dispReq') {
      schemaData = JSON.stringify(communicationDispReqSchema, null, 2);
    } else if (activeTab === 'reply') {
      schemaData = JSON.stringify(communicationReplySchema, null, 2);
    } else if (activeTab === 'representative') {
      schemaData = JSON.stringify(communicationRepresentativeSchema, null, 2);
    }
    return schemaData
  }
  const activeSchema = () => {
    if (activeTab === 'dispReq') {
      return "DispenseRequest";
    } else if (activeTab === 'reply') {
      return "Reply";
    } else if (activeTab === 'representative') {
      return "Representative";
    }
  };
  const handleDownloadSchema = () => {
    let schemaData = currentSchemaJson();
    const blob = new Blob([schemaData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}Schema.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Fragment>
      <div className='App'>
        <header className='App-header'>
          <TabMenu
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </header>
      </div>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className='modal-container'>
          <button onClick={handleDownloadSchema}>Download Schema</button>
          <button className='close-button' onClick={handleCloseModal}>
            Close
          </button>
          <div className='modal-content'>
            <pre>{currentSchemaJson()}</pre>
          </div>
        </div>
      </Modal>
      <Typography variant={'h4'} className={styles.title}>
      {activeSchema()}
      </Typography>
      <button onClick={handleDownloadSchema}>Download Schema</button>
      <button onClick={() => setIsModalOpen(true)}>Show Schema</button>

      {activeTab === 'dispReq' && (
        <SingleForm
          id='dispReq'
          schema={communicationDispReqSchema}
          uischema={communicationDispReqUISchema}
          data={{}}
          renderers={renderers}
          demoData={examples.dispReq}
        />
      )}
      {activeTab === 'reply' && (
        <SingleForm
          id='reply'
          schema={communicationReplySchema}
          uischema={communicationReplyUISchema}
          data={{}}
          renderers={renderers}
          demoData={examples.reply}
        />
      )}
      {activeTab === 'representative' && (
        <SingleForm
          id='representative'
          schema={communicationRepresentativeSchema}
          data={{}}
          renderers={renderers}
          demoData={examples.representative}
        />
      )}
    </Fragment>
  );
};
export default App;
