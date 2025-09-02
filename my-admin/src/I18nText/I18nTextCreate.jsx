import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';

const langChoices = [
    { id: 'de-DE', name: '德語 (de-DE)' },
    { id: 'en-us', name: '英文 (en-us)' },
    { id: 'es-ES', name: '西班牙語 (es-ES)' },
    { id: 'fr-FR', name: '法語 (fr-FR)' },
    { id: 'it-IT', name: '義大利語 (it-IT)' },
    { id: 'ja-JP', name: '日語 (ja-JP)' },
    { id: 'pt-PT', name: '葡萄牙語 (pt-PT)' },
    { id: 'zh-CN', name: '簡體中文 (zh-CN)' },
    { id: 'zh-TW', name: '繁體中文 (zh-TW)' },
];

const I18nTextCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <p>key 必填</p>
            <TextInput source="key" />
            <p>lang 必填</p>
            <SelectInput source="lang" choices={langChoices} />
            <p>text 必填</p>
            <TextInput source="text" />
        </SimpleForm>
    </Create>
);

export default I18nTextCreate;