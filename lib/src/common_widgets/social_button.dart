import 'package:flutter/material.dart';

class SocialButton extends StatelessWidget {
  const SocialButton({required this.icon, this.onTap, super.key});
  final IconData icon;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Icon(
        icon,
        size: 35,
        color: Colors.white,
      ),
    );
  }
}
