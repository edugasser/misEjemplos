/*
 * url = "/apps/form"
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

Ext.ux.Login = Ext.extend(Ext.form.FormPanel, {

    width:250
    ,height:135
    ,username:''
    ,frame:true
    ,title:'Identification'
    ,bodyStyle:"padding:5px 5px 5px 5px"
    ,labelWidth:100
    ,labelAlign:'right'
    ,cls:"easy-login"
    ,redirectUrl:false
    ,defaults:{
        xtype:"textfield"
        ,anchor:"100%"
    
        

    }

    ,initComponent:function() {

    this.submitButton = new Ext.Button({
         text:"v&eacute;rifier"
	    ,iconCls:"icon-key"
	    ,scope:this
	    ,handler:this.submitLogin
    });
    
     this.resetButton = new Ext.Button({
         text:"mot de passe perdu"
	    ,iconCls:"icon-help"
	    ,scope:this
	    ,handler:this.resetPassword
    });
    
    
	this.buttons = [this.submitButton, this.resetButton];

	Ext.apply(this, {
	    items:[{
		fieldLabel:"utilisateur"
		,name:"login"
        ,id:"login"
        ,value:this.username
        ,listeners:{
                scope:this,
                specialkey:function(f,o){
                    if(o.getKey()==13){
                        
                        //console.log(this, f, o);
                        this.submitLogin();
                        //f.submit();
                    }
                }
            }
	    }, {
		fieldLabel:"mot de passe"
		,inputType:"password"
		,name:"password"
        ,id:"password"
        ,value:''
        ,listeners:{
                scope:this,
                specialkey:function(f,o){
                    if(o.getKey()==13){
                        
                        //console.log(this, f, o);
                        this.submitLogin();
                        //f.submit();
                    }
                }
            } 
	    }]
	});

	Ext.ux.Login.superclass.initComponent.apply(this, arguments);
    
    
    
     this.on('afterlayout',function() { 
        if (this.username == '') {
          
            this.getForm().findField('login').focus();
        }
        else {
            this.getForm().findField('password').focus();
        }
     }) 
     
    }
    ,resetPassword:function(btn) {
        Ext.Msg.prompt("votre email", "Saisissez votre email", function(btn, email) {
            if(btn == 'ok') {
                 Ext.Ajax.request({
                    url:'/apps/login/lostpassword',
                    params: {email: email},
                    scope:this,
                    success: function(response) {
                        json = Ext.decode(response.responseText)
                        if (json.success) {
                            
                              Ext.Msg.show({
                               title:'Succès',
                               msg: 'Un email contenant les instructions vous a été envoyé',
                               buttons: Ext.Msg.OK,               
                               icon: Ext.MessageBox.INFO 
                            });
                        }
                        else {
                        
                              Ext.Msg.show({
                               title:'Erreur',
                               msg: json.msg,
                               buttons: Ext.Msg.OK,               
                               icon: Ext.MessageBox.WARNING 
                            });
                        }
                       
                    }
                    ,failure:function() {
                           Ext.Msg.show({
                               title:'Erreur',
                               msg: 'Impossible',
                               buttons: Ext.Msg.OK,               
                               icon: Ext.MessageBox.WARNING 
                            });
                    }
                })
            
            }
        
        }, this)
    
    }
    ,submitLogin:function(btn) {
      //  this.submitButton = btn;
        this.submitButton.disable();
        this.submitButton.setIconClass("icon-loading");

//		Solo existe en la version de login independiente
//        var next = window.location.search ? Ext.urlDecode(window.location.search.substring(1)).next : '';
                 
        this.getForm().submit({
                url:"/apps/login"
//               url:"/apps/login?next=" + next
                ,scope:this
                ,success:this.submitLoginCallback
                ,failure:this.submitLoginCallback
        });
    }

    ,submitLoginCallback:function(form, action) {
        
        var json = Ext.decode(action.response.responseText);
        //alert(json);
        //console.log(json);
        if (json.success === true) window.location = json.redirect;
        else this.error(form, json);
        }
				  
    ,error:function(form, json) {
        //console.log(json);
        Ext.Msg.show({
            buttons: Ext.Msg.OK,
          // fn: processResult,
           animEl: 'elId',
           title: 'erreur',
           msg: 'Mauvais utilisateur ou mot de passe',
           icon: Ext.MessageBox.ERROR
        
        });
        this.submitButton.enable();
        this.submitButton.setIconClass("icon-key");
        
    }
});
