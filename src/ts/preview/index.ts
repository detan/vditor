export class Preview {
    element: HTMLElement

    constructor(vditor: Vditor) {
        this.element = document.createElement('div')
        this.element.className = 'vditor-preview' +
            (vditor.options.classes.preview ? ' ' + vditor.options.classes.preview : '')
        if (!vditor.options.preview.show) {
            this.element.style.display = 'none'
        }
        if (this.element.style.display !== 'none') {
            this.render(vditor)
        }
    }

    render(vditor: Vditor, value?: string) {
        if (this.element.style.display === 'none') {
            return
        }

        if (value) {
            this.element.innerHTML = value
            return
        }

        if (vditor.editor.element.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') === '') {
            this.element.innerHTML = ''
            return
        }

        if (vditor.options.preview.url) {
            clearTimeout(vditor.mdTimeoutId)
            vditor.mdTimeoutId = setTimeout(() => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', vditor.options.preview.url)
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            const responseJSON = JSON.parse(xhr.responseText)
                            if (responseJSON.code !== 0) {
                                alert(responseJSON.msg)
                                return
                            }
                            this.element.innerHTML = responseJSON.data
                            if (vditor.options.preview.parse) {
                                vditor.options.preview.parse(this.element)
                            }
                        }
                    }
                }

                xhr.send(JSON.stringify({
                    markdownText: vditor.editor.element.value,
                }))
            }, vditor.options.preview.delay)
        } else {
            this.element.innerHTML = vditor.editor.element.value
        }
    }
}