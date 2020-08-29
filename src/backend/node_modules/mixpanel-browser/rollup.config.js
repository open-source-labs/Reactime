import npm from 'rollup-plugin-npm';

export default {
    plugins: [
        npm({
            browser: true,
            main: true,
            jsnext: true,
        })
    ]
}
