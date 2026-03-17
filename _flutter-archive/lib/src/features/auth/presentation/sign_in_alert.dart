import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/primary_button.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/common_widgets/secondary_button.dart';
import 'package:portfolio/src/core/common_widgets/title_form_field.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/auth/presentation/auth_controller.dart';
import 'package:portfolio/src/features/auth/presentation/widgets/sign_in_form_field.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/admin_app_route.dart';

class SignInAlert extends ConsumerStatefulWidget {
  const SignInAlert({super.key});

  @override
  ConsumerState<SignInAlert> createState() => _SignInAlertState();
}

class _SignInAlertState extends ConsumerState<SignInAlert> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _emailController;
  late final TextEditingController _passwordController;

  String get email => _emailController.text;
  String get password => _passwordController.text;

  @override
  void initState() {
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = context.l10n;

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Text(l10n.signIn),
      scrollable: true,
      actionsAlignment: MainAxisAlignment.center,
      actionsOverflowButtonSpacing: 15,
      content: ResponsiveCenter(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TitleFormField(title: l10n.emailLabel),
              SignInFormField(
                formType: SignInFormType.email,
                controller: _emailController,
              ),
              gapH14,
              TitleFormField(title: l10n.password),
              SignInFormField(
                formType: SignInFormType.password,
                controller: _passwordController,
              ),
              gapH20,
            ],
          ),
        ),
      ),
      actions: [
        SecondaryButton(
          title: l10n.cancel,
          onTap: () => Navigator.of(context).pop(),
        ),
        PrimaryButton(
          title: l10n.signIn,
          onTap: () {
            if (!_formKey.currentState!.validate()) return;
            ref
                .read(authControllerProvider.notifier)
                .signInWithEmailAndPassword(email, password)
                .whenComplete(() {
              if (!context.mounted) return;
              context
                ..pop()
                ..go(AdminAppRoute.adminTechnologies.path);
            });
          },
        ),
      ],
    );
  }
}
