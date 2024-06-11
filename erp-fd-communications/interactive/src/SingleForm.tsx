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

import { useState, useMemo } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import {
    materialCells,
  } from '@jsonforms/material-renderers';
import { makeStyles } from '@mui/styles';
import { TextField, TextareaAutosize } from '@mui/material';

interface Props {
    // Define your component's props here
    schema: any;
    uischema?: any
    data: any;
    renderers: any;
    id: string;
    demoData?: any
}

const useStyles = makeStyles({
    container: {
      padding: '1em',
      width: '100%',
    },
    title: {
      textAlign: 'left',
      padding: '0.25em',
    },
    dataContent: {
      display: 'flex',
      justifyContent: 'center',
      borderRadius: '0.25em',
      backgroundColor: '#cecece',
      marginBottom: '1rem',
    },
    resetButton: {
      margin: '5px !important',
      display: 'inline-block !important',
    },
    demoform: {
      margin: 'auto',
      padding: '1rem',
    },
    textarea: {
      width: '100%',
      fontSize: '1em',
      padding: '16px',
      fontFamily: 'monospace',
      overflowX: 'scroll'
    }
  });

const SingleForm: React.FC<Props> = (props) => {
    const classes = useStyles();
    const initialData = useMemo(() => {
      const generateInitialData: any = (schema: any) => {
        if (schema.type === 'object') {
          const initialObject: any = {};
          for (const property in schema.properties) {
            initialObject[property] = generateInitialData(schema.properties[property]);
          }
          return initialObject;
        } else if (schema.type === 'array') {
          return [generateInitialData(schema.items)];
        } else if (schema.default) {
          return schema.default
        } else if (schema.$ref) {
          return generateInitialData(props.schema.definitions[schema.$ref.replace('#/definitions/','')])
        } else {
          // debugger;
          return '';
        }
      };

      return generateInitialData(props.schema);
    }, [props.schema]);
    const [data, setData] = useState<any>(initialData);
    const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
    const clearData = () => {
        setData({});
      };

    return (
      <Grid
        container
        justifyContent={'center'}
        spacing={1}
        className={classes.container}
        id={props.id}
      >
        <Grid item sm={8}>
          <Typography variant={'h6'} className={classes.title}>
            Formular
          </Typography>
          <div className={classes.demoform}>
            <JsonForms
              schema={props.schema}
              uischema={props.uischema}
              data={data}
              renderers={props.renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setData(data)}
            />
          </div>
        </Grid>
        <Grid item sm={4} alignContent={'left'}>
          <Typography variant={'h6'} className={classes.title}>
          Demo Data
          </Typography>
          {Object.keys(props.demoData || []).map((key) => (
            <Button
              key={key}
              className={classes.resetButton}
              onClick={() => setData(JSON.parse(props.demoData[key]))}
              color='primary'
              variant='contained'
            >
              {key}
            </Button>
          ))}          
          <TextareaAutosize
            value={stringifiedData}
            onChange={
              (e) => {
                try {
                  const parsedData = JSON.parse(e.target.value);
                  if (parsedData) {
                    setData(parsedData);
                  }  
                } catch (error) {}
              }
            }
             className={classes.textarea}
          />


        </Grid>
      </Grid>
    );
};

export default SingleForm;
