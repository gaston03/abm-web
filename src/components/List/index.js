import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import * as actions from '../../state/actions'
import './style.css'

class List extends Component {

    updateSearch = undefined
    constructor(props) {
        super(props)

        this.state = {
            formValues: this.initialFormValues(),
            isShowModal: false,
            editItem: undefined,
            searchValue: "",
            loading: true,
            items: [],
            filterItems: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleClickClose = this.handleClickClose.bind(this)
        this.handleChangeSearch = this.handleChangeSearch.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.isShowModal = this.isShowModal.bind(this)
    }

    componentWillMount() {
        let self = this
        self.props.actions.personaGet().then((values) => {
            self.setState({ loading: false, items: values.payload.data.result, filterItems: values.payload.data.result})
        })
    }

    componentWillUnmount() {
        clearInterval(this.updateSearch)
    }

    initialFormValues() {
        return { nombre: '', apellido: '', email: '', edad: '' }
    }

    handleClickAdd(){
        this.setState({formValues: this.initialFormValues(), editItem: undefined})
        this.isShowModal()
    }

    handleClickEdit(item) {
        this.setState({formValues: item, editItem: item})
        this.isShowModal()
    }

    handleChange(event) {
        event.preventDefault()
        let formValues = Object.assign({}, this.state.formValues)
        formValues[event.target.name] = event.target.value
        this.setState({formValues: formValues})
    }

    handleSubmit(event) {
        let self = this
        let formValues = self.state.formValues
        self.setState({ loading: true })
        if (self.state.editItem !== undefined) {
            let dataIdx = self.state.items.findIndex(persona => persona._id === this.state.editItem._id)
            self.props.actions.personaEdit(this.state.editItem._id, formValues).then((res) => {
                if (res.error) {
                    self.setState({ loading: false, formValues: this.initialFormValues(), editItem: undefined })
                } else {
                    let items = self.state.items
                    items[dataIdx].nombre = formValues.nombre
                    items[dataIdx].apellido = formValues.apellido
                    items[dataIdx].email = formValues.email
                    items[dataIdx].edad = formValues.edad
                    self.setState({ items: items, loading: false, formValues: this.initialFormValues(), editItem: undefined })
                }
                self.handleSearch()
                self.isShowModal()
            })
        } else {
            self.props.actions.personaAdd(formValues).then((res) => {
                if (res.error) {
                    self.setState({ loading: false, formValues: this.initialFormValues(), editItem: undefined })
                } else {
                    let items = self.state.items
                    items.push(res.payload.data.result)
                    self.setState({ items: items, loading: false, formValues: this.initialFormValues(), editItem: undefined })
                }
                self.handleSearch()
                self.isShowModal()
            })
        }
        event.preventDefault()
    }

    handleClickDelete(item) {
        let self = this
        self.props.actions.personaDelete(item._id).then((res) => {
            let items = self.state.items
            let dataIdx = self.state.items.findIndex(persona => persona._id === item._id)
            items.splice(dataIdx, 1)
            self.setState({loading: false, items: items})
            self.handleSearch()
        })
    }

    handleClickClose(){
        this.isShowModal()
        this.setState({formValues: this.initialFormValues(), editItem: undefined})
    }

    handleChangeSearch(event) {
        this.setState({searchValue: event.target.value})
        if (this.updateSearch) {
            clearTimeout(this.updateSearch)
        }
        this.updateSearch = setTimeout(() => {
            this.handleSearch()
        }, 1000)
    }

    handleSearch() {
        let filterItems = this.state.items.filter(v => v.nombre.toLowerCase().includes(this.state.searchValue.toLowerCase()) || v.email.toLowerCase().includes(this.state.searchValue.toLowerCase()))
        this.setState({filterItems})
    }

    isShowModal(){
        this.setState({isShowModal: !this.state.isShowModal})
    }

    render(){
        let self = this
        let persona = self.state.filterItems.map(function(item, index) {
            return(
                <tr className="item" key={item._id}>
                    <th>{item.nombre + " " + item.apellido}</th>
                    <th>{item.email}</th>
                    <th>{item.edad}</th>
                    <th>
                        <button disabled={self.state.loading} className="th-button" onClick={self.handleClickEdit.bind(self, item)}>Editar</button>
                    </th>
                    <th>
                        <button disabled={self.state.loading} className="th-button" onClick={self.handleClickDelete.bind(self, item)}>Borrar</button>
                    </th>
                </tr>
            )
        })

        return(
            <div>
                <div>
                    <input className="buscar-input" type="text" onChange={this.handleChangeSearch}
                    value={this.state.searchValue} name="nombre" placeholder="Buscar..."/>
                    <button disabled={self.state.loading} className="th-button" onClick={self.handleSearch.bind(self)}>Buscar</button>
                    <button disabled={self.state.loading} className="a-button" onClick={self.handleClickAdd.bind(self)}>+</button>
                </div>

                <table className="table">
                    <thead>
                        <tr className="thead">
                            <th><h5>Nombre</h5></th>
                            <th><h5>Email</h5></th>
                            <th><h5>Edad</h5></th>
                            <th/><th/>
                        </tr>
                    </thead>
                    <tbody className="tbody">
                        {persona}
                    </tbody>
                </table>

                <div className="containerModal" style={self.state.isShowModal ? { display: '', transform: 'translateY(0vh)'} : { display: 'none', transform: 'translateY(-100vh)' }}>
                    <div className="modal">
                        <div className="ml-contenido" width="100" height="80">
                            <form className="form" onSubmit={this.handleSubmit}>
                                <h2>Alta usuario</h2>
                                <input required className="input" type="text" placeholder="Nombre" name="nombre"
                                    onChange={this.handleChange} value={this.state.formValues.nombre}/>
                                <input required className="input" type="text" placeholder="Apellido" name="apellido"
                                    onChange={this.handleChange} value={this.state.formValues.apellido}/>
                                <input required className="input" type="email" placeholder="Email" name="email"
                                    onChange={this.handleChange} value={this.state.formValues.email}/>
                                <input required className="input" type="number" placeholder="Edad" name="edad"
                                    onChange={this.handleChange} value={this.state.formValues.edad}/>
                                <input disabled={self.state.loading} className="form-button" type="submit" value="Guardar" />
                            </form>
                            <button disabled={self.state.loading} className="form-button" onClick={this.handleClickClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        personas: state.personas
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List)
